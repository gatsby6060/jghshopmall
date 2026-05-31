package com.shoppingmall.backend.domain.category.repository;

import com.shoppingmall.backend.domain.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIsNullAndActiveTrueOrderBySortOrder();
    List<Category> findByParentIdAndActiveTrueOrderBySortOrder(Long parentId);

    @Query("SELECT c FROM Category c WHERE c.active = true ORDER BY c.sortOrder")
    List<Category> findAllActive();

    List<Category> findByNameContainingAndActiveTrue(String name);
    List<Category> findByIdInAndActiveTrue(List<Long> ids);
}
