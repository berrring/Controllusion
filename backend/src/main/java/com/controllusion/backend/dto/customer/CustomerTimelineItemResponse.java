package com.controllusion.backend.dto.customer;

import java.time.Instant;
import java.util.UUID;

public record CustomerTimelineItemResponse(
        UUID id,
        String type,
        String title,
        String description,
        Instant date
) {
}
