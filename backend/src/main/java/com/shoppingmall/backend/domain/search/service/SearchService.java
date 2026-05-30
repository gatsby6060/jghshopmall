package com.shoppingmall.backend.domain.search.service;

import com.shoppingmall.backend.domain.product.document.ProductDocument;
import com.shoppingmall.backend.domain.product.repository.ProductDocumentRepository;
import com.shoppingmall.backend.domain.search.entity.SearchKeywordLog;
import com.shoppingmall.backend.domain.search.repository.SearchKeywordLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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

    public List<String> getPopularKeywords() {
        try {
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

    public List<String> getAutocompleteSuggestions(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        // 자동완성 질의 시 비속어가 감지되면 곧바로 빈 제안 목록 반환
        if (badWordService.hasBadWord(keyword)) {
            return List.of();
        }
        try {
            Pageable limit = PageRequest.of(0, 10);
            return productDocumentRepository.findByNamePrefix(keyword.trim(), limit)
                    .stream()
                    .map(ProductDocument::getName)
                    .distinct()
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch autocomplete suggestions from Elasticsearch", e);
            return List.of();
        }
    }
}

