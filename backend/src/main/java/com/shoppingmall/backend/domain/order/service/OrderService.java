package com.shoppingmall.backend.domain.order.service;

import com.shoppingmall.backend.domain.cart.repository.CartItemRepository;
import com.shoppingmall.backend.domain.order.dto.OrderRequest;
import com.shoppingmall.backend.domain.order.dto.OrderResponse;
import com.shoppingmall.backend.domain.order.entity.Order;
import com.shoppingmall.backend.domain.order.entity.OrderItem;
import com.shoppingmall.backend.domain.order.repository.OrderRepository;
import com.shoppingmall.backend.domain.product.entity.Product;
import com.shoppingmall.backend.domain.product.repository.ProductRepository;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.domain.user.repository.UserRepository;
import com.shoppingmall.backend.global.exception.BusinessException;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    public Page<OrderResponse> getMyOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(OrderResponse::from);
    }

    public OrderResponse getOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("주문", orderId));
        if (!order.getUser().getId().equals(userId)) {
            throw new BusinessException("본인의 주문만 조회할 수 있습니다.");
        }
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자", userId));

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("상품", itemReq.productId()));
            if (product.getStock() < itemReq.quantity()) {
                throw new BusinessException(product.getName() + " 재고가 부족합니다.");
            }
            BigDecimal unitPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.quantity()));
            totalAmount = totalAmount.add(itemTotal);

            orderItems.add(OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(unitPrice)
                    .totalPrice(itemTotal)
                    .productName(product.getName())
                    .productThumbnail(product.getThumbnailUrl())
                    .build());

            product.decreaseStock(itemReq.quantity());
            product.increaseSalesCount(itemReq.quantity());
        }

        BigDecimal shippingFee = totalAmount.compareTo(new BigDecimal("50000")) >= 0 ? BigDecimal.ZERO : new BigDecimal("3000");
        BigDecimal finalAmount = totalAmount.add(shippingFee);

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .totalAmount(totalAmount)
                .shippingFee(shippingFee)
                .finalAmount(finalAmount)
                .receiverName(request.receiverName())
                .receiverPhone(request.receiverPhone())
                .zipCode(request.zipCode())
                .address(request.address())
                .addressDetail(request.addressDetail())
                .orderMemo(request.orderMemo())
                .build();

        orderItems.forEach(item -> {
            item.setOrder(order);
            order.getOrderItems().add(item);
        });

        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("주문", orderId));
        if (!order.getUser().getId().equals(userId)) {
            throw new BusinessException("본인의 주문만 취소할 수 있습니다.");
        }
        if (order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.PAYMENT_DONE) {
            throw new BusinessException("취소할 수 없는 주문 상태입니다.");
        }
        order.updateStatus(Order.OrderStatus.CANCELLED);
    }

    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%06d", new Random().nextInt(1000000));
        return "ORD-" + date + "-" + random;
    }
}
