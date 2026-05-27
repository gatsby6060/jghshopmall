package com.shoppingmall.backend.domain.admin.dto;

import java.math.BigDecimal;

public record DailySalesDto(
        String date,
        BigDecimal amount
) {}
