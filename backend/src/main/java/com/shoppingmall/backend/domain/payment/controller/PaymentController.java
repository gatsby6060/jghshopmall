package com.shoppingmall.backend.domain.payment.controller;

import com.shoppingmall.backend.domain.payment.dto.PaymentConfirmRequest;
import com.shoppingmall.backend.domain.payment.dto.PaymentResponse;
import com.shoppingmall.backend.domain.payment.service.PaymentService;
import com.shoppingmall.backend.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shoppingmall.backend.global.event.PaymentEventProducer;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentEventProducer paymentEventProducer;

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(
            @Valid @RequestBody PaymentConfirmRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("결제가 완료되었습니다.", paymentService.confirmPayment(request)));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.getPaymentByOrder(orderId)));
    }

    @GetMapping("/test-load")
    public ResponseEntity<ApiResponse<Void>> testLoad(
            @RequestParam(defaultValue = "30") int tps,
            @RequestParam(defaultValue = "10") int duration) {
        
        new Thread(() -> {
            int totalMessages = tps * duration;
            long intervalMs = 1000 / tps;
            
            for (int i = 1; i <= totalMessages; i++) {
                String dummyOrderId = "LOAD-TEST-ORD-" + System.currentTimeMillis() + "-" + i;
                Long dummyAmount = (long) (Math.random() * 100000) + 1000;
                String dummyEmail = "load-user-" + i + "@example.com";
                
                paymentEventProducer.sendPaymentEvent(dummyOrderId, dummyAmount, dummyEmail);
                
                try {
                    Thread.sleep(intervalMs);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }).start();

        return ResponseEntity.ok(ApiResponse.ok(
            String.format("초당 %d개씩 %d초 동안 총 %d개의 결제 성공 메시지가 카프카로 대형 폭포수처럼 쏟아집니다!", tps, duration, tps * duration)
        ));
    }
}
