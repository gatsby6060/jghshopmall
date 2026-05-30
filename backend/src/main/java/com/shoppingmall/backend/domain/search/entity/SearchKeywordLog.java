package com.shoppingmall.backend.domain.search.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "search_keyword_logs")
@Getter
@NoArgsConstructor
public class SearchKeywordLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String keyword;

    @Column(nullable = false)
    private LocalDateTime searchedAt;

    public SearchKeywordLog(String keyword) {
        this.keyword = keyword;
        this.searchedAt = LocalDateTime.now();
    }
}
