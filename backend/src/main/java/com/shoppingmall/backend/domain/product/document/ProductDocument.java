package com.shoppingmall.backend.domain.product.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;
import com.shoppingmall.backend.domain.product.entity.Product;
import com.shoppingmall.backend.domain.product.dto.ProductResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(indexName = "products")
@Setting(settingPath = "elasticsearch/settings.json")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDocument {

    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
    private String name;

    @Field(type = FieldType.Text, analyzer = "nori", searchAnalyzer = "nori")
    private String description;

    @Field(type = FieldType.Double)
    private Double price;

    @Field(type = FieldType.Double)
    private Double discountPrice;

    @Field(type = FieldType.Integer)
    private int stock;

    @Field(type = FieldType.Keyword)
    private String thumbnailUrl;

    @Field(type = FieldType.Long)
    private Long categoryId;

    @Field(type = FieldType.Keyword)
    private String categoryName;

    @Field(type = FieldType.Keyword)
    private String brand;

    @Field(type = FieldType.Boolean)
    private boolean featured;

    @Field(type = FieldType.Keyword)
    private String status;

    @Field(type = FieldType.Integer)
    private int viewCount;

    @Field(type = FieldType.Integer)
    private int salesCount;

    @Field(type = FieldType.Keyword)
    private String createdAt;

    public static ProductDocument from(Product product) {
        return ProductDocument.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice() != null ? product.getPrice().doubleValue() : null)
                .discountPrice(product.getDiscountPrice() != null ? product.getDiscountPrice().doubleValue() : null)
                .stock(product.getStock())
                .thumbnailUrl(product.getThumbnailUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brand(product.getBrand())
                .featured(product.isFeatured())
                .status(product.getStatus() != null ? product.getStatus().name() : null)
                .viewCount(product.getViewCount())
                .salesCount(product.getSalesCount())
                .createdAt(product.getCreatedAt() != null ? product.getCreatedAt().toString() : null)
                .build();
    }

    public ProductResponse toResponse() {
        return new ProductResponse(
                id,
                name,
                description,
                price != null ? BigDecimal.valueOf(price) : null,
                discountPrice != null ? BigDecimal.valueOf(discountPrice) : null,
                stock,
                thumbnailUrl,
                categoryId,
                categoryName,
                brand,
                featured,
                status,
                viewCount,
                salesCount,
                parseCreatedAt(createdAt)
        );
    }

    private java.time.LocalDateTime parseCreatedAt(String val) {
        if (val == null) return null;
        try {
            if (val.contains("T")) {
                String clean = val;
                if (val.length() > 19) {
                    clean = val.substring(0, 19);
                }
                return java.time.LocalDateTime.parse(clean);
            } else {
                return java.time.LocalDate.parse(val).atStartOfDay();
            }
        } catch (Exception e) {
            return java.time.LocalDateTime.now();
        }
    }
}
