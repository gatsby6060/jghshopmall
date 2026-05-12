package com.shoppingmall.backend.domain.cart.service;

import com.shoppingmall.backend.domain.cart.dto.CartItemRequest;
import com.shoppingmall.backend.domain.cart.dto.CartItemResponse;
import com.shoppingmall.backend.domain.cart.entity.CartItem;
import com.shoppingmall.backend.domain.cart.repository.CartItemRepository;
import com.shoppingmall.backend.domain.product.entity.Product;
import com.shoppingmall.backend.domain.product.repository.ProductRepository;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.domain.user.repository.UserRepository;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<CartItemResponse> getCartItems(Long userId) {
        return cartItemRepository.findByUserIdWithProduct(userId)
                .stream().map(CartItemResponse::from).toList();
    }

    @Transactional
    public CartItemResponse addToCart(Long userId, CartItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자", userId));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("상품", request.productId()));

        return cartItemRepository.findByUserIdAndProductId(userId, request.productId())
                .map(item -> {
                    item.updateQuantity(item.getQuantity() + request.quantity());
                    return CartItemResponse.from(item);
                })
                .orElseGet(() -> {
                    CartItem newItem = CartItem.builder()
                            .user(user)
                            .product(product)
                            .quantity(request.quantity())
                            .build();
                    return CartItemResponse.from(cartItemRepository.save(newItem));
                });
    }

    @Transactional
    public CartItemResponse updateQuantity(Long cartItemId, Long userId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("장바구니 항목", cartItemId));
        if (!item.getUser().getId().equals(userId)) {
            throw new com.shoppingmall.backend.global.exception.BusinessException("본인의 장바구니만 수정할 수 있습니다.");
        }
        item.updateQuantity(quantity);
        return CartItemResponse.from(item);
    }

    @Transactional
    public void removeFromCart(Long cartItemId, Long userId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("장바구니 항목", cartItemId));
        if (!item.getUser().getId().equals(userId)) {
            throw new com.shoppingmall.backend.global.exception.BusinessException("본인의 장바구니만 삭제할 수 있습니다.");
        }
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
