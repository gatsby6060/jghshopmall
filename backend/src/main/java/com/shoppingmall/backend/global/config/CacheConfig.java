package com.shoppingmall.backend.global.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        // 사용 가능한 캐시 이름들을 미리 정의하여 등록합니다.
        cacheManager.setCacheNames(List.of("rootCategories", "allCategories", "category", "popularKeywords"));
        
        // 1. 카테고리 캐시용 설정 (TTL 없음, 변경 시 강제 무효화)
        Caffeine<Object, Object> categoryCacheSpec = Caffeine.newBuilder()
                .initialCapacity(100)
                .maximumSize(500);

        // 2. 인기 검색어 캐시용 설정 (5분 만료, On-Demand 갱신)
        Caffeine<Object, Object> popularKeywordsCacheSpec = Caffeine.newBuilder()
                .initialCapacity(10)
                .maximumSize(100)
                .expireAfterWrite(5, TimeUnit.MINUTES);

        // 캐시 이름별로 커스텀 설정을 빌드하여 매핑합니다.
        cacheManager.registerCustomCache("rootCategories", categoryCacheSpec.build());
        cacheManager.registerCustomCache("allCategories", categoryCacheSpec.build());
        cacheManager.registerCustomCache("category", categoryCacheSpec.build());
        cacheManager.registerCustomCache("popularKeywords", popularKeywordsCacheSpec.build());

        return cacheManager;
    }
}
