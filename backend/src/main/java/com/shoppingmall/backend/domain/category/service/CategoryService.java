package com.shoppingmall.backend.domain.category.service;

import com.shoppingmall.backend.domain.category.dto.CategoryRequest;
import com.shoppingmall.backend.domain.category.dto.CategoryResponse;
import com.shoppingmall.backend.domain.category.entity.Category;
import com.shoppingmall.backend.domain.category.repository.CategoryRepository;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getRootCategories() {
        return categoryRepository.findByParentIsNullAndActiveTrueOrderBySortOrder()
                .stream().map(CategoryResponse::from).toList();
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllActive()
                .stream().map(CategoryResponse::from).toList();
    }

    public CategoryResponse getCategory(Long id) {
        return CategoryResponse.from(categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("카테고리", id)));
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
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
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("카테고리", id));
        category.update(request.name(), request.description(), request.imageUrl(), request.sortOrder());
        return CategoryResponse.from(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("카테고리", id));
        categoryRepository.delete(category);
    }
}
