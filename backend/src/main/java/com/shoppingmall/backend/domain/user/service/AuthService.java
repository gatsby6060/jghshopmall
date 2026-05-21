package com.shoppingmall.backend.domain.user.service;

import com.shoppingmall.backend.domain.user.dto.LoginRequest;
import com.shoppingmall.backend.domain.user.dto.SignupRequest;
import com.shoppingmall.backend.domain.user.dto.TokenResponse;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.domain.user.repository.UserRepository;
import com.shoppingmall.backend.global.exception.BusinessException;
import com.shoppingmall.backend.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public TokenResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("이미 사용 중인 이메일입니다.");
        }
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .phone(request.phone())
                .provider(User.Provider.LOCAL)
                .role(User.Role.USER)
                .build();
        userRepository.save(user);
        return generateTokens(user);
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("이메일 또는 비밀번호가 올바르지 않습니다."));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        if (!user.isEnabled()) {
            throw new BusinessException("비활성화된 계정입니다.");
        }
        return generateTokens(user);
    }

    public TokenResponse refresh(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("유효하지 않은 리프레시 토큰입니다.");
        }
        Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("사용자를 찾을 수 없습니다."));
        return generateTokens(user);
    }

    private TokenResponse generateTokens(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getName(), user.getRole().name(), user.getProvider().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        return new TokenResponse(accessToken, refreshToken, user.getId(), user.getEmail(), user.getName(), user.getRole().name());
    }
}
