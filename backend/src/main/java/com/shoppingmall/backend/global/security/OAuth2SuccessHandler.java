package com.shoppingmall.backend.global.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        DefaultOAuth2User oAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
        Long userId = (Long) oAuth2User.getAttributes().get("id");
        String email = (String) oAuth2User.getAttributes().get("email");
        String role = authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        String accessToken = jwtTokenProvider.generateAccessToken(userId, email, role);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userId);

        String redirectUrl = frontendUrl + "/oauth2/callback?accessToken=" + accessToken + "&refreshToken=" + refreshToken;
        response.sendRedirect(redirectUrl);
    }
}
