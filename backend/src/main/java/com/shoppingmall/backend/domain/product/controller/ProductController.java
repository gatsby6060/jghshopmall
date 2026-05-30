package com.shoppingmall.backend.domain.product.controller;

import com.shoppingmall.backend.domain.product.dto.ProductRequest;
import com.shoppingmall.backend.domain.product.dto.ProductResponse;
import com.shoppingmall.backend.domain.product.service.ProductService;
import com.shoppingmall.backend.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProducts(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProducts(pageable)));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductsByCategory(categoryId, pageable)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> searchProducts(
            @RequestParam String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productService.searchProducts(keyword, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProduct(id)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getFeaturedProducts()));
    }

    @GetMapping("/new")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getNewProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getNewProducts()));
    }

    @GetMapping("/best")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getBestProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getBestProducts()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("상품이 등록되었습니다.", productService.createProduct(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("상품이 수정되었습니다.", productService.updateProduct(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("상품이 삭제되었습니다."));
    }

    @PostMapping("/reindex")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> reindexProducts() {
        productService.reindexAll();
        return ResponseEntity.ok(ApiResponse.ok("전체 상품의 엘라스틱서치 재색인이 완료되었습니다."));
    }
}
