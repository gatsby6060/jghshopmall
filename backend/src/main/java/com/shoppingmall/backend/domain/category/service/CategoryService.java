package com.shoppingmall.backend.domain.category.service;

import com.shoppingmall.backend.domain.category.dto.CategoryRequest;
import com.shoppingmall.backend.domain.category.dto.CategoryResponse;
import com.shoppingmall.backend.domain.category.entity.Category;
import com.shoppingmall.backend.domain.category.repository.CategoryRepository;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Cacheable(value = "rootCategories")
    public List<CategoryResponse> getRootCategories() {
        log.info("Fetching root categories from database (Cache Miss)");
        return categoryRepository.findByParentIsNullAndActiveTrueOrderBySortOrder()
                .stream().map(CategoryResponse::from).toList();
    }

    @Cacheable(value = "allCategories")
    public List<CategoryResponse> getAllCategories() {
        log.info("Fetching all categories from database (Cache Miss)");
        return categoryRepository.findAllActive()
                .stream().map(CategoryResponse::from).toList();
    }

    @Cacheable(value = "category", key = "#id")
    public CategoryResponse getCategory(Long id) {
        log.info("Fetching category with id {} from database (Cache Miss)", id);
        return CategoryResponse.from(categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("카테고리", id)));
    }

    @Transactional
    @CacheEvict(value = {"rootCategories", "allCategories", "category"}, allEntries = true)
    public CategoryResponse createCategory(CategoryRequest request) {
        log.info("Creating a new category. Evicting all category caches.");
        Category parent = null;
        if (request.parentId() != null) {
            parent = categoryRepository.findById(request.parentId())
                    .orElseThrow(() -> new ResourceNotFoundException("부모 카테고리", request.parentId()));
        }
        Category category = Category.builder()
                .name(request.name())
                .slug(request.slug())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .parent(parent)
                .sortOrder(request.sortOrder())
                .build();
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    @CacheEvict(value = {"rootCategories", "allCategories", "category"}, allEntries = true)
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        log.info("Updating category with id {}. Evicting all category caches.", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("카테고리", id));
        category.update(request.name(), request.description(), request.imageUrl(), request.sortOrder());
        return CategoryResponse.from(category);
    }

    @Transactional
    @CacheEvict(value = {"rootCategories", "allCategories", "category"}, allEntries = true)
    public void deleteCategory(Long id) {
        log.info("Deleting category with id {}. Evicting all category caches.", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("카테고리", id));
        categoryRepository.delete(category);
    }
}
