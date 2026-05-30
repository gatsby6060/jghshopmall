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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SearchService {

    private final SearchKeywordLogRepository keywordLogRepository;
    private final ProductDocumentRepository productDocumentRepository;
    private final BadWordService badWordService;

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
            if (trimmedKeyword.length() > 1) {
                keywordLogRepository.save(new SearchKeywordLog(trimmedKeyword));
            }
        } catch (Exception e) {
            log.error("Failed to log search keyword: {}", keyword, e);
        }
    }

    public List<String> getPopularKeywords() {
        try {
            LocalDateTime since = LocalDateTime.now().minusDays(7);
            return keywordLogRepository.findTopKeywords(since, PageRequest.of(0, 10));
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

