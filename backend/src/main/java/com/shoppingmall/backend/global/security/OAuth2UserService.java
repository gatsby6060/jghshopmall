package com.shoppingmall.backend.global.security;

import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2UserInfo userInfo = extractUserInfo(registrationId, oAuth2User.getAttributes());
        User.Provider provider = User.Provider.valueOf(registrationId.toUpperCase());

        User user = userRepository.findByProviderAndProviderId(provider, userInfo.id())
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(userInfo.email() != null ? userInfo.email() : userInfo.id() + "@" + registrationId + ".oauth")
                                .name(userInfo.name())
                                .profileImageUrl(userInfo.profileImageUrl())
                                .provider(provider)
                                .providerId(userInfo.id())
                                .role(User.Role.USER)
                                .build()
                ));

        return new DefaultOAuth2User(
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                Map.of("id", user.getId(), "email", user.getEmail(), "name", user.getName()),
                "id"
        );
    }

    private OAuth2UserInfo extractUserInfo(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId.toLowerCase()) {
            case "google" -> new OAuth2UserInfo(
                    (String) attributes.get("sub"),
                    (String) attributes.get("email"),
                    (String) attributes.get("name"),
                    (String) attributes.get("picture")
            );
            case "naver" -> {
                @SuppressWarnings("unchecked")
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");
                yield new OAuth2UserInfo(
                        (String) response.get("id"),
                        (String) response.get("email"),
                        (String) response.get("name"),
                        (String) response.get("profile_image")
                );
            }
            case "kakao" -> {
                @SuppressWarnings("unchecked")
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                @SuppressWarnings("unchecked")
                Map<String, Object> profile = kakaoAccount != null ? (Map<String, Object>) kakaoAccount.get("profile") : Map.of();
                yield new OAuth2UserInfo(
                        String.valueOf(attributes.get("id")),
                        kakaoAccount != null ? (String) kakaoAccount.get("email") : null,
                        profile != null ? (String) profile.get("nickname") : null,
                        profile != null ? (String) profile.get("profile_image_url") : null
                );
            }
            case "apple" -> new OAuth2UserInfo(
                    (String) attributes.get("sub"),
                    (String) attributes.get("email"),
                    (String) attributes.getOrDefault("name", "Apple User"),
                    null
            );
            default -> throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인: " + registrationId);
        };
    }

    private record OAuth2UserInfo(String id, String email, String name, String profileImageUrl) {}
}
