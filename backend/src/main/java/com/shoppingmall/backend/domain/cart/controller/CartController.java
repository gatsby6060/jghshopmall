package com.shoppingmall.backend.domain.cart.controller;

import com.shoppingmall.backend.domain.cart.dto.CartItemRequest;
import com.shoppingmall.backend.domain.cart.dto.CartItemResponse;
import com.shoppingmall.backend.domain.cart.service.CartService;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCartItems(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCartItems(user.getId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartItemResponse>> addToCart(
            @Valid @RequestBody CartItemRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("장바구니에 추가되었습니다.", cartService.addToCart(user.getId(), request)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateQuantity(
            @PathVariable Long id,
            @RequestParam int quantity,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.updateQuantity(id, user.getId(), quantity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        cartService.removeFromCart(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("장바구니에서 삭제되었습니다."));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("장바구니를 비웠습니다."));
    }
}
