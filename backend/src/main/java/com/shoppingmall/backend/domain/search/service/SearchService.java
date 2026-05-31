package com.shoppingmall.backend.domain.search.service;

import com.shoppingmall.backend.domain.product.document.ProductDocument;
import com.shoppingmall.backend.domain.product.repository.ProductDocumentRepository;
import com.shoppingmall.backend.domain.search.entity.SearchKeywordLog;
import com.shoppingmall.backend.domain.search.repository.SearchKeywordLogRepository;
import com.shoppingmall.backend.domain.search.dto.AutocompleteResponseDto;
import com.shoppingmall.backend.domain.search.dto.CategorySuggestionDto;
import com.shoppingmall.backend.domain.category.entity.Category;
import com.shoppingmall.backend.domain.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SearchService {

    private final SearchKeywordLogRepository keywordLogRepository;
    private final ProductDocumentRepository productDocumentRepository;
    private final BadWordService badWordService;
    private final CategoryRepository categoryRepository;

    // 완성형 한글, 영문자, 숫자, 공백만 허용 (자모 단독 문자(ㄱ-ㅎ, ㅏ-ㅣ)나 무의미한 특수문자 차단)
    private static final Pattern VALID_KEYWORD_PATTERN = Pattern.compile("^[가-힣a-zA-Z0-9\\s]+$");

    @Transactional
    public void logSearch(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return;
        }
        try {
            // 비속어가 감지되면 로깅을 건너뜀 (인기 검색어 오염 방지)
            if (badWordService.hasBadWord(keyword)) {
                log.warn("Search keyword logging skipped due to bad word detection: {}", keyword);
                return;
            }

            String trimmedKeyword = keyword.trim().toLowerCase();
            
            // 1글자 이하이거나 자모 단독 문자(ㅡㅊㅕㅅㅣㅌ 등)가 섞인 비정상 단어는 수집 제외
            if (trimmedKeyword.length() <= 1 || !VALID_KEYWORD_PATTERN.matcher(trimmedKeyword).matches()) {
                return;
            }

            keywordLogRepository.save(new SearchKeywordLog(trimmedKeyword));
        } catch (Exception e) {
            log.error("Failed to log search keyword: {}", keyword, e);
        }
    }

    @Cacheable(value = "popularKeywords")
    public List<String> getPopularKeywords() {
        try {
            log.info("Fetching popular keywords from database (Cache Miss)");
            LocalDateTime since = LocalDateTime.now().minusDays(7);
            // DB에서 넉넉하게 30개를 가져온 후, 실시간으로 비속어 및 자모 분리 키워드 필터링 적용
            List<String> rawKeywords = keywordLogRepository.findTopKeywords(since, PageRequest.of(0, 30));
            
            return rawKeywords.stream()
                    .map(String::trim)
                    .filter(k -> k.length() > 1)
                    .filter(k -> VALID_KEYWORD_PATTERN.matcher(k).matches()) // 실시간으로 자모음 분리 단어 차단
                    .filter(k -> !badWordService.hasBadWord(k))              // 실시간으로 비속어 차단 (과거 누적 로그 필터링)
                    .limit(10)                                                // 최종 상위 10개만 표출
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch popular search keywords, returning empty list", e);
            return List.of();
        }
    }

    public AutocompleteResponseDto getAutocompleteSuggestions(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new AutocompleteResponseDto(List.of(), List.of());
        }
        // 자동완성 질의 시 비속어가 감지되면 곧바로 빈 결과 반환
        if (badWordService.hasBadWord(keyword)) {
            return new AutocompleteResponseDto(List.of(), List.of());
        }
        try {
            String cleanKeyword = keyword.trim();
            Pageable limit = PageRequest.of(0, 10);
            
            // 1. Elasticsearch에서 상품명 접두사 일치하는 목록 조회
            List<ProductDocument> products = productDocumentRepository.findByNamePrefix(cleanKeyword, limit);
            
            // 2. 검색 추천 키워드 추출
            List<String> suggestions = products.stream()
                    .map(ProductDocument::getName)
                    .distinct()
                    .collect(Collectors.toList());
            
            // 3. 연관 카테고리 추출
            List<Category> allSuggestedCategories = new ArrayList<>();
            
            // 3-1. 카테고리 이름 자체에 검색 키워드가 포함된 경우 찾기
            List<Category> directCategories = categoryRepository.findByNameContainingAndActiveTrue(cleanKeyword);
            allSuggestedCategories.addAll(directCategories);
            
            // 3-2. 검색된 상품들이 속한 카테고리 ID 목록 수집 및 조회
            List<Long> categoryIds = products.stream()
                    .map(ProductDocument::getCategoryId)
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());
            
            if (!categoryIds.isEmpty()) {
                List<Category> productCategories = categoryRepository.findByIdInAndActiveTrue(categoryIds);
                allSuggestedCategories.addAll(productCategories);
            }
            
            // 3-3. 중복 제거 및 DTO 변환 (최대 5개 제한)
            List<CategorySuggestionDto> categorySuggestions = allSuggestedCategories.stream()
                    .filter(Objects::nonNull)
                    .collect(Collectors.toMap(
                            Category::getId,
                            cat -> cat,
                            (existing, replacement) -> existing // ID 중복 시 기존 것 유지
                    ))
                    .values()
                    .stream()
                    .map(cat -> new CategorySuggestionDto(cat.getId(), cat.getName(), buildFullPath(cat)))
                    .limit(5)
                    .collect(Collectors.toList());
            
            return new AutocompleteResponseDto(suggestions, categorySuggestions);
        } catch (Exception e) {
            log.error("Failed to fetch autocomplete suggestions", e);
            return new AutocompleteResponseDto(List.of(), List.of());
        }
    }

    private String buildFullPath(Category category) {
        List<String> names = new ArrayList<>();
        Category current = category;
        while (current != null) {
            names.add(0, current.getName());
            current = current.getParent();
        }
        return String.join(" > ", names);
    }
}

