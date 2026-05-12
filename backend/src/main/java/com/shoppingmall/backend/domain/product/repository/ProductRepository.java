package com.shoppingmall.backend.domain.product.repository;

import com.shoppingmall.backend.domain.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryIdAndStatus(Long categoryId, Product.ProductStatus status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    List<Product> findTop8ByFeaturedTrueAndStatus(Product.ProductStatus status);

    List<Product> findTop8ByStatusOrderByCreatedAtDesc(Product.ProductStatus status);

    List<Product> findTop8ByStatusOrderBySalesCountDesc(Product.ProductStatus status);

    Page<Product> findByStatus(Product.ProductStatus status, Pageable pageable);
}
