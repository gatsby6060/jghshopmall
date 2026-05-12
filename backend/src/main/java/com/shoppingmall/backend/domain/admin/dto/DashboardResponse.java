package com.shoppingmall.backend.domain.admin.dto;

public record DashboardResponse(
        long totalUsers,
        long totalProducts,
        long totalOrders
) {}
