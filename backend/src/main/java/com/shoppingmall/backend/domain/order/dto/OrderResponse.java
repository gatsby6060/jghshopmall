package com.shoppingmall.backend.domain.order.dto;

import com.shoppingmall.backend.domain.order.entity.Order;
import com.shoppingmall.backend.domain.order.entity.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        String status,
        BigDecimal totalAmount,
        BigDecimal discountAmount,
        BigDecimal shippingFee,
        BigDecimal finalAmount,
        String receiverName,
        String receiverPhone,
        String zipCode,
        String address,
        String addressDetail,
        String orderMemo,
        List<OrderItemResponse> items,
        LocalDateTime createdAt
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getDiscountAmount(),
                order.getShippingFee(),
                order.getFinalAmount(),
                order.getReceiverName(),
                order.getReceiverPhone(),
                order.getZipCode(),
                order.getAddress(),
                order.getAddressDetail(),
                order.getOrderMemo(),
                order.getOrderItems().stream().map(OrderItemResponse::from).toList(),
                order.getCreatedAt()
        );
    }

    public record OrderItemResponse(
            Long id,
            Long productId,
            String productName,
            String productThumbnail,
            int quantity,
            BigDecimal unitPrice,
            BigDecimal totalPrice
    ) {
        public static OrderItemResponse from(OrderItem item) {
            return new OrderItemResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProductName(),
                    item.getProductThumbnail(),
                    item.getQuantity(),
                    item.getUnitPrice(),
                    item.getTotalPrice()
            );
        }
    }
}
