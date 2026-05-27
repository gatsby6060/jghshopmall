package com.shoppingmall.backend.domain.admin.dto;

import java.math.BigDecimal;

public record MonthlySalesDto(
        String month,
        BigDecimal amount
) {}
