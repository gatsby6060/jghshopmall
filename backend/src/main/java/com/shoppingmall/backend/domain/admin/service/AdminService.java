package com.shoppingmall.backend.domain.admin.service;

import com.shoppingmall.backend.domain.admin.dto.DashboardResponse;
import com.shoppingmall.backend.domain.admin.dto.DailySalesDto;
import com.shoppingmall.backend.domain.admin.dto.MonthlySalesDto;
import com.shoppingmall.backend.domain.admin.dto.SalesStatsResponse;
import com.shoppingmall.backend.domain.admin.dto.TopProductDto;
import com.shoppingmall.backend.domain.admin.entity.AccessLog;
import com.shoppingmall.backend.domain.admin.entity.BlockedIp;
import com.shoppingmall.backend.domain.admin.repository.AccessLogRepository;
import com.shoppingmall.backend.domain.admin.repository.BlockedIpRepository;
import com.shoppingmall.backend.domain.order.dto.OrderResponse;
import com.shoppingmall.backend.domain.order.entity.Order;
import com.shoppingmall.backend.domain.order.entity.OrderItem;
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

    public SalesStatsResponse getSalesStats() {
        java.time.LocalDateTime startDate = java.time.LocalDateTime.now().minusMonths(6).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        java.util.List<Order> orders = orderRepository.findPaidOrdersAfter(startDate);

        // 1. 일별 매출 계산 (최근 7일 기준)
        java.util.Map<String, java.math.BigDecimal> dailyMap = new java.util.HashMap<>();
        for (int i = 6; i >= 0; i--) {
            String dateStr = java.time.LocalDate.now().minusDays(i).toString();
            dailyMap.put(dateStr, java.math.BigDecimal.ZERO);
        }
        for (Order order : orders) {
            String dateStr = order.getCreatedAt().toLocalDate().toString();
            if (dailyMap.containsKey(dateStr)) {
                dailyMap.put(dateStr, dailyMap.get(dateStr).add(order.getFinalAmount()));
            }
        }
        java.util.List<DailySalesDto> dailySales = dailyMap.entrySet().stream()
                .map(e -> new DailySalesDto(e.getKey(), e.getValue()))
                .sorted(java.util.Comparator.comparing(DailySalesDto::date))
                .toList();

        // 2. 월별 매출 계산 (최근 6달 기준)
        java.util.Map<String, java.math.BigDecimal> monthlyMap = new java.util.LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            java.time.LocalDate date = java.time.LocalDate.now().minusMonths(i);
            String monthStr = String.format("%d-%02d", date.getYear(), date.getMonthValue());
            monthlyMap.put(monthStr, java.math.BigDecimal.ZERO);
        }
        for (Order order : orders) {
            java.time.LocalDateTime dt = order.getCreatedAt();
            String monthStr = String.format("%d-%02d", dt.getYear(), dt.getMonthValue());
            if (monthlyMap.containsKey(monthStr)) {
                monthlyMap.put(monthStr, monthlyMap.get(monthStr).add(order.getFinalAmount()));
            }
        }
        java.util.List<MonthlySalesDto> monthlySales = monthlyMap.entrySet().stream()
                .map(e -> new MonthlySalesDto(e.getKey(), e.getValue()))
                .toList();

        // 3. 인기 상품 통계 (수량 기준 상위 5개)
        java.util.Map<Long, TopProductDtoTemp> productMap = new java.util.HashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct() == null) continue;
                Long productId = item.getProduct().getId();
                String productName = item.getProductName();
                int qty = item.getQuantity();
                java.math.BigDecimal sales = item.getTotalPrice();

                if (productMap.containsKey(productId)) {
                    TopProductDtoTemp temp = productMap.get(productId);
                    temp.qty += qty;
                    temp.sales = temp.sales.add(sales);
                } else {
                    productMap.put(productId, new TopProductDtoTemp(productId, productName, qty, sales));
                }
            }
        }
        java.util.List<TopProductDto> topProducts = productMap.values().stream()
                .map(t -> new TopProductDto(t.productId, t.productName, t.qty, t.sales))
                .sorted(java.util.Comparator.comparing(TopProductDto::quantitySold).reversed())
                .limit(5)
                .toList();

        return new SalesStatsResponse(dailySales, monthlySales, topProducts);
    }

    private static class TopProductDtoTemp {
        Long productId;
        String productName;
        long qty;
        java.math.BigDecimal sales;
        TopProductDtoTemp(Long productId, String productName, long qty, java.math.BigDecimal sales) {
            this.productId = productId;
            this.productName = productName;
            this.qty = qty;
            this.sales = sales;
        }
    }
}
