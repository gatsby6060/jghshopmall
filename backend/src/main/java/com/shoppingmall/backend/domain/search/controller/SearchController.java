package com.shoppingmall.backend.domain.search.controller;

import com.shoppingmall.backend.domain.search.service.SearchService;
import com.shoppingmall.backend.domain.search.service.BadWordService;
import com.shoppingmall.backend.domain.search.dto.AutocompleteResponseDto;
import com.shoppingmall.backend.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;
    private final BadWordService badWordService;

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<String>>> getPopularKeywords() {
        return ResponseEntity.ok(ApiResponse.ok(searchService.getPopularKeywords()));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<ApiResponse<AutocompleteResponseDto>> getAutocompleteSuggestions(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.ok(searchService.getAutocompleteSuggestions(keyword)));
    }

    @PostMapping("/badwords")
    public ResponseEntity<ApiResponse<Void>> addBadWord(
            @RequestParam String word,
            @RequestParam(defaultValue = "false") boolean allowed) {
        badWordService.addWord(word, allowed);
        return ResponseEntity.ok(ApiResponse.ok("비속어 필터 설정이 완료되었습니다. (단어: " + word + ", 허용 여부: " + allowed + ")"));
    }

    @DeleteMapping("/badwords")
    public ResponseEntity<ApiResponse<Void>> removeBadWord(@RequestParam String word) {
        badWordService.removeWord(word);
        return ResponseEntity.ok(ApiResponse.ok("비속어 필터에서 단어가 정상 삭제되었습니다. (단어: " + word + ")"));
    }

    @PostMapping("/badwords/reload")
    public ResponseEntity<ApiResponse<Void>> reloadFilter() {
        badWordService.reloadFilter();
        return ResponseEntity.ok(ApiResponse.ok("비속어 필터가 강제 리로드되었습니다."));
    }
}


