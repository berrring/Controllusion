package com.controllusion.backend.dto.dashboard;

import java.math.BigDecimal;

public record DashboardRevenuePointResponse(
        String name,
        BigDecimal revenue,
        long deals
) {
}
