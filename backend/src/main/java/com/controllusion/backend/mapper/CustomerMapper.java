package com.controllusion.backend.mapper;

import com.controllusion.backend.dto.customer.CustomerDealResponse;
import com.controllusion.backend.dto.customer.CustomerNoteEntryResponse;
import com.controllusion.backend.dto.customer.CustomerResponse;
import com.controllusion.backend.dto.customer.CustomerTimelineItemResponse;
import com.controllusion.backend.entity.Customer;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerResponse toResponse(Customer customer) {
        String ownerName = customer.getOwner() != null ? customer.getOwner().getFullName() : "Controllusion";

        return new CustomerResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getCompany(),
                customer.getJobTitle(),
                customer.getStatus().getDisplayName(),
                customer.getStage().getDisplayName(),
                customer.getDealValue(),
                customer.getNotes(),
                customer.getLocation(),
                customer.getIndustry(),
                customer.getLastContactedAt(),
                customer.getCreatedAt(),
                customer.getUpdatedAt(),
                buildTimeline(customer),
                buildDeals(customer),
                buildNotes(customer, ownerName)
        );
    }

    private List<CustomerTimelineItemResponse> buildTimeline(Customer customer) {
        List<CustomerTimelineItemResponse> items = new ArrayList<>();
        items.add(new CustomerTimelineItemResponse(
                UUID.nameUUIDFromBytes((customer.getId() + ":created").getBytes()),
                "Create",
                "Customer record created",
                customer.getFullName() + " was added to the CRM.",
                customer.getCreatedAt()
        ));

        if (customer.getUpdatedAt() != null && !customer.getUpdatedAt().equals(customer.getCreatedAt())) {
            items.add(new CustomerTimelineItemResponse(
                    UUID.nameUUIDFromBytes((customer.getId() + ":updated").getBytes()),
                    "Update",
                    "Customer record updated",
                    "Profile details or pipeline status were updated.",
                    customer.getUpdatedAt()
            ));
        }

        if (customer.getLastContactedAt() != null) {
            items.add(new CustomerTimelineItemResponse(
                    UUID.nameUUIDFromBytes((customer.getId() + ":contacted").getBytes()),
                    "Follow-up",
                    "Customer contact checkpoint",
                    "Latest customer touchpoint captured for pipeline tracking.",
                    customer.getLastContactedAt()
            ));
        }

        return items.stream()
                .sorted((left, right) -> right.date().compareTo(left.date()))
                .toList();
    }

    private List<CustomerDealResponse> buildDeals(Customer customer) {
        Instant closeDate = (customer.getUpdatedAt() != null ? customer.getUpdatedAt() : customer.getCreatedAt())
                .plus(14, ChronoUnit.DAYS);

        return List.of(new CustomerDealResponse(
                UUID.nameUUIDFromBytes((customer.getId() + ":deal").getBytes()),
                customer.getCompany() + " opportunity",
                customer.getDealValue(),
                customer.getStage().getDisplayName(),
                closeDate
        ));
    }

    private List<CustomerNoteEntryResponse> buildNotes(Customer customer, String author) {
        if (customer.getNotes() == null || customer.getNotes().isBlank()) {
            return List.of();
        }

        Instant noteDate = customer.getUpdatedAt() != null ? customer.getUpdatedAt() : customer.getCreatedAt();
        return List.of(new CustomerNoteEntryResponse(
                UUID.nameUUIDFromBytes((customer.getId() + ":note").getBytes()),
                author,
                customer.getNotes(),
                noteDate
        ));
    }
}
