package com.shoppingmall.backend.domain.payment.dto;

import com.shoppingmall.backend.domain.payment.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long orderId,
        String paymentKey,
        String method,
        String status,
        BigDecimal amount,
        String pgProvider,
        LocalDateTime paidAt,
        LocalDateTime createdAt
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getPaymentKey(),
                payment.getMethod().name(),
                payment.getStatus().name(),
                payment.getAmount(),
                payment.getPgProvider(),
                payment.getPaidAt(),
                payment.getCreatedAt()
        );
    }
}
