package com.shoppingmall.backend.domain.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "상품명은 필수입니다.") String name,
        String description,
        @NotNull(message = "가격은 필수입니다.") @Min(0) BigDecimal price,
        BigDecimal discountPrice,
        @Min(0) int stock,
        String thumbnailUrl,
        @NotNull(message = "카테고리는 필수입니다.") Long categoryId,
        String brand,
        boolean featured,
        String status
) {}
