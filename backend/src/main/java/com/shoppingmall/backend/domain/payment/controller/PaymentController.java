package com.shoppingmall.backend.domain.payment.controller;

import com.shoppingmall.backend.domain.payment.dto.PaymentConfirmRequest;
import com.shoppingmall.backend.domain.payment.dto.PaymentResponse;
import com.shoppingmall.backend.domain.payment.service.PaymentService;
import com.shoppingmall.backend.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(
            @Valid @RequestBody PaymentConfirmRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("결제가 완료되었습니다.", paymentService.confirmPayment(request)));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.getPaymentByOrder(orderId)));
    }
}
