package com.shoppingmall.backend.domain.product.entity;

import com.shoppingmall.backend.domain.category.entity.Category;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.shoppingmall.backend.domain.product.listener.ProductEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@EntityListeners({AuditingEntityListener.class, ProductEntityListener.class})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(precision = 12, scale = 2)
    private BigDecimal discountPrice;

    @Column(nullable = false)
    @Builder.Default
    private int stock = 0;

    @Column(length = 255)
    private String thumbnailUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @Column(nullable = false)
    @Builder.Default
    private int viewCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private int salesCount = 0;

    @Column(length = 100)
    private String brand;

    @Column(length = 50)
    private String sku;

    @Builder.Default
    private boolean featured = false;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void update(String name, String description, BigDecimal price, BigDecimal discountPrice,
                       int stock, String thumbnailUrl, Category category, ProductStatus status,
                       String brand, boolean featured) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.discountPrice = discountPrice;
        this.stock = stock;
        this.thumbnailUrl = thumbnailUrl;
        this.category = category;
        this.status = status;
        this.brand = brand;
        this.featured = featured;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

    public void decreaseStock(int quantity) {
        if (this.stock < quantity) {
            throw new IllegalStateException("재고가 부족합니다.");
        }
        this.stock -= quantity;
    }

    public void increaseSalesCount(int quantity) {
        this.salesCount += quantity;
    }

    public enum ProductStatus {
        ACTIVE, INACTIVE, OUT_OF_STOCK
    }
}
