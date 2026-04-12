package com.controllusion.backend.dto.dashboard;

import java.time.Instant;
import java.util.UUID;

public record DashboardTaskResponse(
        UUID id,
        String title,
        String description,
        String owner,
        String status,
        Instant dueDate
) {
}
