package com.shoppingmall.backend.domain.order.repository;

import com.shoppingmall.backend.domain.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);

    @Query("SELECT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.product WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product " +
           "WHERE o.status NOT IN (com.shoppingmall.backend.domain.order.entity.Order.OrderStatus.PENDING, com.shoppingmall.backend.domain.order.entity.Order.OrderStatus.CANCELLED) " +
           "AND o.createdAt >= :startDate")
    java.util.List<Order> findPaidOrdersAfter(@Param("startDate") java.time.LocalDateTime startDate);
}
