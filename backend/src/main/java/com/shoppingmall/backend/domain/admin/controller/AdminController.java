package com.shoppingmall.backend.domain.admin.controller;

import com.shoppingmall.backend.domain.admin.dto.DashboardResponse;
import com.shoppingmall.backend.domain.admin.service.AdminService;
import com.shoppingmall.backend.domain.order.dto.OrderResponse;
import com.shoppingmall.backend.domain.order.entity.Order;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboard()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUsers(pageable)));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(
            @PathVariable Long id, @RequestParam String role) {
        adminService.updateUserRole(id, User.Role.valueOf(role));
        return ResponseEntity.ok(ApiResponse.ok("사용자 권한이 변경되었습니다."));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrders(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getOrders(pageable)));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateOrderStatus(
            @PathVariable Long id, @RequestParam String status) {
        adminService.updateOrderStatus(id, Order.OrderStatus.valueOf(status));
        return ResponseEntity.ok(ApiResponse.ok("주문 상태가 변경되었습니다."));
    }
}
