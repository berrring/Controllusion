package com.controllusion.backend.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryResponse(
        long totalCustomers,
        long activeDeals,
        BigDecimal pipelineValue,
        int conversionRate,
        List<DashboardRevenuePointResponse> revenue,
        List<DashboardActivityResponse> activity,
        List<DashboardTaskResponse> tasks
) {
}
