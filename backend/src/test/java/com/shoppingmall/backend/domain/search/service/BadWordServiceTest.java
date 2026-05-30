package com.shoppingmall.backend.domain.search.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class BadWordServiceTest {

    @Autowired
    private BadWordService badWordService;

    @Test
    @DisplayName("기본 비속어가 텍스트에 포함되어 있으면 차단 처리(true)된다")
    void testHasBadWord() {
        // Given
        String query1 = "이거 진짜 바보 같네요";
        String query2 = "개새끼야 저리 가";
        String query3 = "정상적인 검색어입니다";

        // When & Then
        assertThat(badWordService.hasBadWord(query1)).isTrue();
        assertThat(badWordService.hasBadWord(query2)).isTrue();
        assertThat(badWordService.hasBadWord(query3)).isFalse();
    }

    @Test
    @DisplayName("화이트리스트(허용단어)에 매칭되는 경우 비속어가 포함되어 있어도 통과(false)한다")
    void testWhitelistException() {
        // Given
        // '착한바보'는 기본적으로 허용 단어로 등록되어 있음 ("바보"가 금지어여도 통과해야 함)
        String query = "나는 착한바보 입니다";

        // When & Then
        assertThat(badWordService.hasBadWord(query)).isFalse();
    }

    @Test
    @DisplayName("새로운 비속어를 동적으로 추가하면 즉시 실시간 차단된다")
    void testDynamicBadWordAddition() {
        // Given
        String query = "새로지은욕설단어 입니다";
        assertThat(badWordService.hasBadWord(query)).isFalse();

        // When
        badWordService.addWord("새로지은욕설단어", false);

        // Then
        assertThat(badWordService.hasBadWord(query)).isTrue();

        // Clean Up (remove)
        badWordService.removeWord("새로지은욕설단어");
        assertThat(badWordService.hasBadWord(query)).isFalse();
    }
}
