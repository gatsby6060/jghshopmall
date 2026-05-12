package com.shoppingmall.backend.domain.payment.service;

import com.shoppingmall.backend.domain.order.entity.Order;
import com.shoppingmall.backend.domain.order.repository.OrderRepository;
import com.shoppingmall.backend.domain.payment.dto.PaymentConfirmRequest;
import com.shoppingmall.backend.domain.payment.dto.PaymentResponse;
import com.shoppingmall.backend.domain.payment.entity.Payment;
import com.shoppingmall.backend.domain.payment.repository.PaymentRepository;
import com.shoppingmall.backend.global.exception.BusinessException;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    @Value("${toss.secret-key:test_sk_dummy}")
    private String tossSecretKey;

    private static final String TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

    @Transactional
    public PaymentResponse confirmPayment(PaymentConfirmRequest request) {
        Order order = orderRepository.findByOrderNumber(request.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("주문을 찾을 수 없습니다: " + request.orderId()));

        if (order.getFinalAmount().compareTo(new BigDecimal(request.amount())) != 0) {
            throw new BusinessException("결제 금액이 주문 금액과 일치하지 않습니다.");
        }

        // 토스페이먼츠 결제 승인 API 호출
        String encodedKey = Base64.getEncoder()
                .encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Basic " + encodedKey);

        Map<String, Object> body = Map.of(
                "paymentKey", request.paymentKey(),
                "orderId", request.orderId(),
                "amount", request.amount()
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(TOSS_CONFIRM_URL, entity, Map.class);

            Payment payment = Payment.builder()
                    .order(order)
                    .paymentKey(request.paymentKey())
                    .method(Payment.PaymentMethod.CARD)
                    .amount(new BigDecimal(request.amount()))
                    .pgProvider("TOSS")
                    .build();

            payment.confirm(request.paymentKey(), response.getBody() != null ? response.getBody().toString() : "");
            order.updateStatus(Order.OrderStatus.PAYMENT_DONE);

            return PaymentResponse.from(paymentRepository.save(payment));
        } catch (Exception e) {
            log.error("Payment confirmation failed: {}", e.getMessage());
            throw new BusinessException("결제 승인에 실패했습니다: " + e.getMessage());
        }
    }

    public PaymentResponse getPaymentByOrder(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("결제 정보를 찾을 수 없습니다."));
        return PaymentResponse.from(payment);
    }
}
