package com.shoppingmall.backend.domain.product.dto;

import com.shoppingmall.backend.domain.product.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        BigDecimal discountPrice,
        int stock,
        String thumbnailUrl,
        Long categoryId,
        String categoryName,
        String brand,
        boolean featured,
        String status,
        int viewCount,
        int salesCount,
        LocalDateTime createdAt
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getDiscountPrice(),
                product.getStock(),
                product.getThumbnailUrl(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getBrand(),
                product.isFeatured(),
                product.getStatus().name(),
                product.getViewCount(),
                product.getSalesCount(),
                product.getCreatedAt()
        );
    }
}
