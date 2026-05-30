package com.shoppingmall.backend.domain.search.controller;

import com.shoppingmall.backend.domain.search.service.SearchService;
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

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<String>>> getPopularKeywords() {
        return ResponseEntity.ok(ApiResponse.ok(searchService.getPopularKeywords()));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<ApiResponse<List<String>>> getAutocompleteSuggestions(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.ok(searchService.getAutocompleteSuggestions(keyword)));
    }
}
