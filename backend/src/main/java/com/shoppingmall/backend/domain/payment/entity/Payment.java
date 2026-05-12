package com.shoppingmall.backend.domain.payment.entity;

import com.shoppingmall.backend.domain.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false, length = 100)
    private String paymentKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(length = 255)
    private String pgTransactionId;

    @Column(length = 255)
    private String pgProvider;

    private LocalDateTime paidAt;

    @Column(columnDefinition = "TEXT")
    private String rawResponse;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void confirm(String pgTransactionId, String rawResponse) {
        this.pgTransactionId = pgTransactionId;
        this.rawResponse = rawResponse;
        this.status = PaymentStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = PaymentStatus.CANCELLED;
    }

    public enum PaymentMethod {
        CARD, VIRTUAL_ACCOUNT, TRANSFER, MOBILE, KAKAO_PAY, NAVER_PAY, TOSS_PAY
    }

    public enum PaymentStatus {
        PENDING, PAID, CANCELLED, FAILED, REFUNDED
    }
}
