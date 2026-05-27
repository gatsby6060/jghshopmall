package com.shoppingmall.backend.domain.admin.dto;

import java.math.BigDecimal;

public record TopProductDto(
        Long productId,
        String productName,
        long quantitySold,
        BigDecimal totalSales
) {}
