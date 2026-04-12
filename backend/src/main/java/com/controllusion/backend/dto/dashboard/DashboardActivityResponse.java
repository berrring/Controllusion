package com.controllusion.backend.dto.dashboard;

import java.time.Instant;
import java.util.UUID;

public record DashboardActivityResponse(
        UUID id,
        String type,
        String title,
        String description,
        UUID customerId,
        String customerName,
        Instant date
) {
}
