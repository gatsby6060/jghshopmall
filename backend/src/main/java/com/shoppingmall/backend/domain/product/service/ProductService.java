package com.shoppingmall.backend.domain.product.service;

import com.shoppingmall.backend.domain.category.entity.Category;
import com.shoppingmall.backend.domain.category.repository.CategoryRepository;
import com.shoppingmall.backend.domain.product.dto.ProductRequest;
import com.shoppingmall.backend.domain.product.dto.ProductResponse;
import com.shoppingmall.backend.domain.product.entity.Product;
import com.shoppingmall.backend.domain.product.repository.ProductRepository;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> getProducts(Pageable pageable) {
        return productRepository.findByStatus(Product.ProductStatus.ACTIVE, pageable)
                .map(ProductResponse::from);
    }

    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndStatus(categoryId, Product.ProductStatus.ACTIVE, pageable)
                .map(ProductResponse::from);
    }

    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchByKeyword(keyword, pageable)
                .map(ProductResponse::from);
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("상품", id));
        return ProductResponse.from(product);
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findTop8ByFeaturedTrueAndStatus(Product.ProductStatus.ACTIVE)
                .stream().map(ProductResponse::from).toList();
    }

    public List<ProductResponse> getNewProducts() {
        return productRepository.findTop8ByStatusOrderByCreatedAtDesc(Product.ProductStatus.ACTIVE)
                .stream().map(ProductResponse::from).toList();
    }

    public List<ProductResponse> getBestProducts() {
        return productRepository.findTop8ByStatusOrderBySalesCountDesc(Product.ProductStatus.ACTIVE)
                .stream().map(ProductResponse::from).toList();
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("카테고리", request.categoryId()));
        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .discountPrice(request.discountPrice())
                .stock(request.stock())
                .thumbnailUrl(request.thumbnailUrl())
                .category(category)
                .brand(request.brand())
                .featured(request.featured())
                .build();
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("상품", id));
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("카테고리", request.categoryId()));
        product.update(request.name(), request.description(), request.price(), request.discountPrice(),
                request.stock(), request.thumbnailUrl(), category,
                Product.ProductStatus.valueOf(request.status()), request.brand(), request.featured());
        return ProductResponse.from(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("상품", id));
        productRepository.delete(product);
    }
}
