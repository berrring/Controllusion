package com.controllusion.backend.dto.customer;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String fullName,
        String email,
        String phone,
        String company,
        String jobTitle,
        String status,
        String stage,
        BigDecimal dealValue,
        String notes,
        String location,
        String industry,
        Instant lastContactedAt,
        Instant createdAt,
        Instant updatedAt,
        List<CustomerTimelineItemResponse> timeline,
        List<CustomerDealResponse> deals,
        List<CustomerNoteEntryResponse> noteEntries
) {
}
