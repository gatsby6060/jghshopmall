package com.shoppingmall.backend.global.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " ID " + id + "를 찾을 수 없습니다.");
    }
}
