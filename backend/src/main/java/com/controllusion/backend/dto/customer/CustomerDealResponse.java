package com.controllusion.backend.dto.customer;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CustomerDealResponse(
        UUID id,
        String title,
        BigDecimal amount,
        String stage,
        Instant closeDate
) {
}
