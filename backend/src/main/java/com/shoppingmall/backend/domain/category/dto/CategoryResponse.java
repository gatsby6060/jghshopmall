package com.shoppingmall.backend.domain.category.dto;

import com.shoppingmall.backend.domain.category.entity.Category;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        String imageUrl,
        Long parentId,
        int sortOrder,
        boolean active
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                category.getParent() != null ? category.getParent().getId() : null,
                category.getSortOrder(),
                category.isActive()
        );
    }
}
