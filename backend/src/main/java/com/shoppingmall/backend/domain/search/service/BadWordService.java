package com.shoppingmall.backend.domain.search.service;

import com.shoppingmall.backend.domain.search.entity.BadWord;
import com.shoppingmall.backend.domain.search.repository.BadWordRepository;
import com.shoppingmall.backend.global.util.AhoCorasickFilter;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BadWordService {

    private final BadWordRepository badWordRepository;
    private final AhoCorasickFilter ahoCorasickFilter;

    private Set<String> whitelist = Set.of();

    @PostConstruct
    public void init() {
        try {
            if (badWordRepository.count() == 0) {
                insertDefaultBadWords();
            } else {
                reloadFilter();
            }
        } catch (Exception e) {
            log.error("Failed to initialize BadWordService", e);
        }
    }

    @Transactional
    public void reloadFilter() {
        try {
            // 1. 비속어(allowed = false) 로드 -> 아호-코라식 빌드
            List<String> blacklistedWords = badWordRepository.findByAllowed(false)
                    .stream()
                    .map(BadWord::getWord)
                    .map(String::toLowerCase)
                    .collect(Collectors.toList());
            ahoCorasickFilter.build(blacklistedWords);

            // 2. 허용어(allowed = true) 로드 -> 화이트리스트 메모리 캐시 갱신
            whitelist = badWordRepository.findByAllowed(true)
                    .stream()
                    .map(BadWord::getWord)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

            log.info("BadWord Filter successfully reloaded. Blacklist size: {}, Whitelist size: {}", 
                    blacklistedWords.size(), whitelist.size());
        } catch (Exception e) {
            log.error("Failed to reload BadWord filter", e);
        }
    }

    private void insertDefaultBadWords() {
        log.info("Inserting default bad words into database for initialization...");
        List<String> defaultBadWords = List.of(
            "바보", "멍청이", "쓰레기", "개새끼", "시발", "존나", "씨발", "병신"
        );
        for (String word : defaultBadWords) {
            badWordRepository.save(new BadWord(word, false));
        }
        badWordRepository.save(new BadWord("착한바보", true)); // 테스트용 예외 허용어 주입
        reloadFilter();
    }

    /**
     * 텍스트 내 비속어 유무 검사 (화이트리스트 예외 처리 적용)
     */
    public boolean hasBadWord(String text) {
        if (text == null || text.trim().isEmpty()) {
            return false;
        }
        String target = text.trim().toLowerCase();

        // 1. 아호-코라식을 통한 비속어 추출
        List<String> matchedBadWords = ahoCorasickFilter.findMatchedBadWords(target);
        if (matchedBadWords.isEmpty()) {
            return false;
        }

        // 2. 화이트리스트 매칭 검증
        for (String badWord : matchedBadWords) {
            boolean isWhitelisted = false;
            for (String allowed : whitelist) {
                if (target.contains(allowed)) {
                    isWhitelisted = true;
                    break;
                }
            }
            if (!isWhitelisted) {
                // 허용 목록에 없는 진짜 비속어 발견!
                return true;
            }
        }
        return false;
    }

    @Transactional
    public void addWord(String word, boolean allowed) {
        String cleanWord = word.trim().toLowerCase();
        badWordRepository.findByWord(cleanWord).ifPresentOrElse(
            existing -> existing.updateAllowed(allowed),
            () -> badWordRepository.save(new BadWord(cleanWord, allowed))
        );
        reloadFilter();
    }

    @Transactional
    public void removeWord(String word) {
        String cleanWord = word.trim().toLowerCase();
        badWordRepository.findByWord(cleanWord).ifPresent(badWord -> {
            badWordRepository.delete(badWord);
            reloadFilter();
        });
    }
}
