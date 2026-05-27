package com.shoppingmall.backend.domain.admin.dto;

import java.util.List;

public record SalesStatsResponse(
        List<DailySalesDto> dailySales,
        List<MonthlySalesDto> monthlySales,
        List<TopProductDto> topProducts
) {}
