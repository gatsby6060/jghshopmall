package com.shoppingmall.backend.domain.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(
        @NotEmpty(message = "주문 상품은 필수입니다.") List<OrderItemRequest> items,
        @NotBlank(message = "수령인 이름은 필수입니다.") String receiverName,
        @NotBlank(message = "수령인 전화번호는 필수입니다.") String receiverPhone,
        @NotBlank(message = "우편번호는 필수입니다.") String zipCode,
        @NotBlank(message = "주소는 필수입니다.") String address,
        String addressDetail,
        String orderMemo
) {
    public record OrderItemRequest(Long productId, int quantity) {}
}
