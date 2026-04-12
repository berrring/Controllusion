package com.controllusion.backend.service;

import com.controllusion.backend.dto.dashboard.DashboardActivityResponse;
import com.controllusion.backend.dto.dashboard.DashboardRevenuePointResponse;
import com.controllusion.backend.dto.dashboard.DashboardSummaryResponse;
import com.controllusion.backend.dto.dashboard.DashboardTaskResponse;
import com.controllusion.backend.entity.Customer;
import com.controllusion.backend.entity.CustomerStage;
import com.controllusion.backend.repository.CustomerRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private static final List<CustomerStage> ACTIVE_STAGES = List.of(
            CustomerStage.QUALIFIED,
            CustomerStage.PROPOSAL,
            CustomerStage.NEGOTIATION
    );

    private final CustomerRepository customerRepository;

    public DashboardService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public DashboardSummaryResponse getSummary() {
        List<Customer> customers = customerRepository.findAll();
        long totalCustomers = customers.size();
        long activeDeals = customers.stream().filter(customer -> ACTIVE_STAGES.contains(customer.getStage())).count();
        BigDecimal pipelineValue = customers.stream()
                .map(Customer::getDealValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long wonDeals = customers.stream().filter(customer -> customer.getStage() == CustomerStage.WON).count();
        int conversionRate = totalCustomers == 0 ? 0 : (int) Math.round((wonDeals * 100.0) / totalCustomers);

        return new DashboardSummaryResponse(
                totalCustomers,
                activeDeals,
                pipelineValue,
                conversionRate,
                buildRevenue(customers),
                buildActivity(customers),
                buildTasks(customers)
        );
    }

    private List<DashboardRevenuePointResponse> buildRevenue(List<Customer> customers) {
        Map<YearMonth, DashboardRevenuePointResponse> points = new LinkedHashMap<>();
        YearMonth currentMonth = YearMonth.now(ZoneOffset.UTC);
        for (int i = 5; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);
            points.put(month, new DashboardRevenuePointResponse(month.getMonth().name().substring(0, 1)
                    + month.getMonth().name().substring(1, 3).toLowerCase(), BigDecimal.ZERO, 0));
        }

        for (Customer customer : customers) {
            Instant activityDate = customer.getUpdatedAt() != null ? customer.getUpdatedAt() : customer.getCreatedAt();
            YearMonth bucket = YearMonth.from(activityDate.atZone(ZoneOffset.UTC));
            if (!points.containsKey(bucket)) {
                continue;
            }

            DashboardRevenuePointResponse current = points.get(bucket);
            BigDecimal additionalRevenue = customer.getStage() == CustomerStage.WON ? customer.getDealValue() : BigDecimal.ZERO;
            long deals = current.deals() + 1;
            points.put(bucket, new DashboardRevenuePointResponse(current.name(), current.revenue().add(additionalRevenue), deals));
        }

        return new ArrayList<>(points.values());
    }

    private List<DashboardActivityResponse> buildActivity(List<Customer> customers) {
        return customers.stream()
                .sorted(Comparator.comparing(Customer::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(6)
                .map(customer -> new DashboardActivityResponse(
                        UUID.nameUUIDFromBytes((customer.getId() + ":activity").getBytes()),
                        "Update",
                        "Customer pipeline reviewed",
                        customer.getFullName() + " is currently in " + customer.getStage().getDisplayName() + " stage.",
                        customer.getId(),
                        customer.getFullName(),
                        customer.getUpdatedAt() != null ? customer.getUpdatedAt() : customer.getCreatedAt()
                ))
                .toList();
    }

    private List<DashboardTaskResponse> buildTasks(List<Customer> customers) {
        return customers.stream()
                .filter(customer -> customer.getStage() != CustomerStage.WON && customer.getStage() != CustomerStage.LOST)
                .sorted(Comparator.comparing(Customer::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(5)
                .map(customer -> new DashboardTaskResponse(
                        UUID.nameUUIDFromBytes((customer.getId() + ":task").getBytes()),
                        "Follow up with " + customer.getFullName(),
                        "Move " + customer.getCompany() + " toward the next pipeline step.",
                        customer.getOwner() != null ? customer.getOwner().getFullName() : "Sales team",
                        "Pending",
                        (customer.getLastContactedAt() != null ? customer.getLastContactedAt() : Instant.now()).plus(3, ChronoUnit.DAYS)
                ))
                .toList();
    }
}
