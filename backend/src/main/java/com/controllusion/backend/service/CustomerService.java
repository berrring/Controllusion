package com.controllusion.backend.service;

import com.controllusion.backend.dto.customer.CustomerRequest;
import com.controllusion.backend.dto.customer.CustomerResponse;
import com.controllusion.backend.entity.Customer;
import com.controllusion.backend.entity.CustomerStage;
import com.controllusion.backend.entity.CustomerStatus;
import com.controllusion.backend.entity.User;
import com.controllusion.backend.exception.DuplicateResourceException;
import com.controllusion.backend.exception.ResourceNotFoundException;
import com.controllusion.backend.mapper.CustomerMapper;
import com.controllusion.backend.repository.CustomerRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final UserService userService;

    public CustomerService(
            CustomerRepository customerRepository,
            CustomerMapper customerMapper,
            UserService userService
    ) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> getCustomers(
            String search,
            String status,
            String stage,
            String sort,
            Integer page,
            Integer size
    ) {
        Specification<Customer> specification = buildSpecification(search, status, stage);
        PageRequest pageRequest = PageRequest.of(
                Math.max(page != null ? page : 0, 0),
                Math.max(size != null ? size : 100, 1),
                resolveSort(sort)
        );

        return customerRepository.findAll(specification, pageRequest).stream()
                .map(customerMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomer(UUID customerId) {
        return customerMapper.toResponse(findCustomerEntity(customerId));
    }

    public CustomerResponse createCustomer(CustomerRequest request, UUID authenticatedUserId) {
        if (customerRepository.existsByEmailIgnoreCase(request.email().trim())) {
            throw new DuplicateResourceException("A customer with this email already exists.");
        }

        User owner = userService.findUserEntity(authenticatedUserId);
        Customer customer = new Customer();
        applyCustomerRequest(customer, request);
        customer.setOwner(owner);

        return customerMapper.toResponse(customerRepository.save(customer));
    }

    public CustomerResponse updateCustomer(UUID customerId, CustomerRequest request) {
        Customer customer = findCustomerEntity(customerId);
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (customerRepository.existsByEmailIgnoreCaseAndIdNot(normalizedEmail, customerId)) {
            throw new DuplicateResourceException("A customer with this email already exists.");
        }

        applyCustomerRequest(customer, request);
        return customerMapper.toResponse(customerRepository.save(customer));
    }

    public void deleteCustomer(UUID customerId) {
        Customer customer = findCustomerEntity(customerId);
        customerRepository.delete(customer);
    }

    @Transactional(readOnly = true)
    public Customer findCustomerEntity(UUID customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));
    }

    private void applyCustomerRequest(Customer customer, CustomerRequest request) {
        customer.setFullName(request.fullName().trim());
        customer.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        customer.setPhone(request.phone().trim());
        customer.setCompany(request.company().trim());
        customer.setJobTitle(request.jobTitle() == null || request.jobTitle().isBlank() ? null : request.jobTitle().trim());
        customer.setStatus(CustomerStatus.fromValue(request.status()));
        customer.setStage(CustomerStage.fromValue(request.stage()));
        customer.setDealValue(request.dealValue());
        customer.setNotes(request.notes() == null || request.notes().isBlank() ? null : request.notes().trim());
        customer.setLocation(request.location() == null || request.location().isBlank() ? null : request.location().trim());
        customer.setIndustry(request.industry() == null || request.industry().isBlank() ? null : request.industry().trim());
        customer.setLastContactedAt(java.time.Instant.now());
    }

    private Specification<Customer> buildSpecification(String search, String status, String stage) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("company")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), pattern)
                ));
            }

            if (status != null && !status.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("status"), CustomerStatus.fromValue(status)));
            }

            if (stage != null && !stage.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("stage"), CustomerStage.fromValue(stage)));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank() || "newest".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        if ("name".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.ASC, "fullName");
        }

        if ("dealValue".equalsIgnoreCase(sort) || "deal_value".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.DESC, "dealValue");
        }

        return Sort.by(Sort.Direction.DESC, "createdAt");
    }
}
