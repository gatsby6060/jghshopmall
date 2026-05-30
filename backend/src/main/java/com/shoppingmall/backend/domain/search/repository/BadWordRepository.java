package com.shoppingmall.backend.domain.search.repository;

import com.shoppingmall.backend.domain.search.entity.BadWord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BadWordRepository extends JpaRepository<BadWord, Long> {
    Optional<BadWord> findByWord(String word);
    List<BadWord> findByAllowed(boolean allowed);
}
