package com.shoppingmall.backend.domain.user.controller;

import com.shoppingmall.backend.domain.user.dto.LoginRequest;
import com.shoppingmall.backend.domain.user.dto.SignupRequest;
import com.shoppingmall.backend.domain.user.dto.TokenResponse;
import com.shoppingmall.backend.domain.user.service.AuthService;
import com.shoppingmall.backend.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<TokenResponse>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("회원가입이 완료되었습니다.", authService.signup(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("로그인 성공", authService.login(request)));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(@RequestParam String refreshToken) {
        return ResponseEntity.ok(ApiResponse.ok(authService.refresh(refreshToken)));
    }
}
