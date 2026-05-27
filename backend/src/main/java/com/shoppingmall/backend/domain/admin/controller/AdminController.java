package com.shoppingmall.backend.domain.admin.controller;

import com.shoppingmall.backend.domain.admin.dto.DashboardResponse;
import com.shoppingmall.backend.domain.admin.dto.SalesStatsResponse;
import com.shoppingmall.backend.domain.admin.entity.AccessLog;
import com.shoppingmall.backend.domain.admin.entity.BlockedIp;
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
import java.util.List;

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

    // 접속 IP 모니터링 로그 조회
    @GetMapping("/access-logs")
    public ResponseEntity<ApiResponse<Page<AccessLog>>> getAccessLogs(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAccessLogs(pageable)));
    }

    // 차단된 IP 리스트 조회
    @GetMapping("/blocked-ips")
    public ResponseEntity<ApiResponse<List<BlockedIp>>> getBlockedIps() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getBlockedIps()));
    }

    // 특정 IP 차단 추가
    @PostMapping("/blocked-ips")
    public ResponseEntity<ApiResponse<Void>> blockIp(
            @RequestParam String ipAddress, @RequestParam(required = false, defaultValue = "") String reason) {
        adminService.blockIp(ipAddress, reason);
        return ResponseEntity.ok(ApiResponse.ok("해당 IP가 접속 차단되었습니다."));
    }

    // 차단 해제
    @DeleteMapping("/blocked-ips/{id}")
    public ResponseEntity<ApiResponse<Void>> unblockIp(@PathVariable Long id) {
        adminService.unblockIp(id);
        return ResponseEntity.ok(ApiResponse.ok("접속 차단이 해제되었습니다."));
    }

    // 매출 및 인기 상품 통계 데이터 조회
    @GetMapping("/sales-stats")
    public ResponseEntity<ApiResponse<SalesStatsResponse>> getSalesStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getSalesStats()));
    }
}
