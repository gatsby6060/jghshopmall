package com.shoppingmall.backend.domain.search.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bad_words", indexes = {
    @Index(name = "idx_bad_word", columnList = "word", unique = true)
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BadWord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String word;

    @Column(nullable = false)
    private boolean allowed = false; // true: 허용 단어(화이트리스트), false: 비속어(블랙리스트)

    private LocalDateTime createdAt;

    public BadWord(String word, boolean allowed) {
        this.word = word;
        this.allowed = allowed;
        this.createdAt = LocalDateTime.now();
    }

    public void updateAllowed(boolean allowed) {
        this.allowed = allowed;
    }
}
