package com.shoppingmall.backend.domain.order.controller;

import com.shoppingmall.backend.domain.order.dto.OrderRequest;
import com.shoppingmall.backend.domain.order.dto.OrderResponse;
import com.shoppingmall.backend.domain.order.service.OrderService;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getMyOrders(user.getId(), pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrder(id, user.getId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("주문이 완료되었습니다.", orderService.createOrder(user.getId(), request)));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        orderService.cancelOrder(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("주문이 취소되었습니다."));
    }
}
