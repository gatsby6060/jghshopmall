package com.shoppingmall.backend.global.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentEventLogRepository extends JpaRepository<PaymentEventLog, Long> {
    Optional<PaymentEventLog> findByOrderId(String orderId);
}
