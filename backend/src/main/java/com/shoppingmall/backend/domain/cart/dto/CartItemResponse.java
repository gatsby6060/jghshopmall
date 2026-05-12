package com.shoppingmall.backend.domain.cart.dto;

import com.shoppingmall.backend.domain.cart.entity.CartItem;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String productThumbnail,
        BigDecimal price,
        BigDecimal discountPrice,
        int quantity,
        int stock
) {
    public static CartItemResponse from(CartItem item) {
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getThumbnailUrl(),
                item.getProduct().getPrice(),
                item.getProduct().getDiscountPrice(),
                item.getQuantity(),
                item.getProduct().getStock()
        );
    }
}
