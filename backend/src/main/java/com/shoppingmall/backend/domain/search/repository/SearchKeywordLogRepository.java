package com.shoppingmall.backend.domain.search.repository;

import com.shoppingmall.backend.domain.search.entity.SearchKeywordLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SearchKeywordLogRepository extends JpaRepository<SearchKeywordLog, Long> {

    @Query("SELECT s.keyword FROM SearchKeywordLog s " +
           "WHERE s.searchedAt >= :since " +
           "GROUP BY s.keyword " +
           "ORDER BY COUNT(s.keyword) DESC")
    List<String> findTopKeywords(@Param("since") LocalDateTime since, Pageable pageable);
}
