package com.shoppingmall.backend.domain.product.service;

import com.shoppingmall.backend.domain.category.entity.Category;
import com.shoppingmall.backend.domain.category.repository.CategoryRepository;
import com.shoppingmall.backend.domain.product.document.ProductDocument;
import com.shoppingmall.backend.domain.product.dto.ProductRequest;
import com.shoppingmall.backend.domain.product.dto.ProductResponse;
import com.shoppingmall.backend.domain.product.entity.Product;
import com.shoppingmall.backend.domain.product.repository.ProductDocumentRepository;
import com.shoppingmall.backend.domain.product.repository.ProductRepository;
import com.shoppingmall.backend.domain.search.service.SearchService;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductDocumentRepository productDocumentRepository;
    private final SearchService searchService;

    public Page<ProductResponse> getProducts(Pageable pageable) {
        return productRepository.findByStatus(Product.ProductStatus.ACTIVE, pageable)
                .map(ProductResponse::from);
    }

    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndStatus(categoryId, Product.ProductStatus.ACTIVE, pageable)
                .map(ProductResponse::from);
    }

    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        searchService.logSearch(keyword);

        try {
            log.info("Searching products in Elasticsearch with keyword: {}", keyword);
            Page<ProductDocument> docs = productDocumentRepository.searchFuzzy(keyword, pageable);
            if (docs != null && docs.getTotalElements() > 0) {
                return docs.map(ProductDocument::toResponse);
            }
        } catch (Exception e) {
            log.error("Elasticsearch search failed, falling back to MariaDB search", e);
        }

        log.info("Falling back to MariaDB search with keyword: {}", keyword);
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

    @Transactional
    public void reindexAll() {
        try {
            productDocumentRepository.deleteAll();
            List<Product> activeProducts = productRepository.findByStatus(Product.ProductStatus.ACTIVE, Pageable.unpaged()).getContent();
            if (!activeProducts.isEmpty()) {
                List<ProductDocument> docs = activeProducts.stream()
                        .map(ProductDocument::from)
                        .collect(Collectors.toList());
                productDocumentRepository.saveAll(docs);
                log.info("Successfully reindexed {} active products manually.", docs.size());
            }
        } catch (Exception e) {
            log.error("Failed to reindex products manually", e);
            throw new RuntimeException("엘라스틱서치 재색인에 실패했습니다: " + e.getMessage(), e);
        }
    }
}
