package com.shoppingmall.backend.domain.admin.service;

import com.shoppingmall.backend.domain.admin.dto.DashboardResponse;
import com.shoppingmall.backend.domain.admin.entity.AccessLog;
import com.shoppingmall.backend.domain.admin.entity.BlockedIp;
import com.shoppingmall.backend.domain.admin.repository.AccessLogRepository;
import com.shoppingmall.backend.domain.admin.repository.BlockedIpRepository;
import com.shoppingmall.backend.domain.order.dto.OrderResponse;
import com.shoppingmall.backend.domain.order.entity.Order;
import com.shoppingmall.backend.domain.order.repository.OrderRepository;
import com.shoppingmall.backend.domain.product.repository.ProductRepository;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.domain.user.repository.UserRepository;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AccessLogRepository accessLogRepository;
    private final BlockedIpRepository blockedIpRepository;

    public Page<AccessLog> getAccessLogs(Pageable pageable) {
        return accessLogRepository.findAllByOrderByTimestampDesc(pageable);
    }

    public List<BlockedIp> getBlockedIps() {
        return blockedIpRepository.findAll();
    }

    @Transactional
    public void blockIp(String ipAddress, String reason) {
        if (!blockedIpRepository.existsByIpAddress(ipAddress)) {
            BlockedIp blockedIp = new BlockedIp(ipAddress, reason, LocalDateTime.now());
            blockedIpRepository.save(blockedIp);
        }
    }

    @Transactional
    public void unblockIp(Long id) {
        blockedIpRepository.deleteById(id);
    }

    public DashboardResponse getDashboard() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        return new DashboardResponse(totalUsers, totalProducts, totalOrders);
    }

    public Page<User> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    public void updateUserRole(Long userId, User.Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자", userId));
        user.updateRole(role);
    }

    public Page<OrderResponse> getOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderResponse::from);
    }

    @Transactional
    public void updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("주문", orderId));
        order.updateStatus(status);
    }
}
