package com.shoppingmall.backend.global.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

public class AhoCorasickFilterTest {

    @Test
    @DisplayName("아호-코라식 알고리즘으로 등록한 여러 비속어들이 문장에서 정확하게 감지되는지 검증한다")
    void testAhoCorasickDetection() {
        // Given
        AhoCorasickFilter filter = new AhoCorasickFilter();
        List<String> badWords = List.of("바보", "멍청이", "개새끼", "시발");
        filter.build(badWords);

        // When & Then
        // 1. 비속어가 포함된 경우
        List<String> match1 = filter.findMatchedBadWords("너 진짜 바보냐?");
        assertThat(match1).contains("바보");

        List<String> match2 = filter.findMatchedBadWords("개새끼 저리가라 시발아");
        assertThat(match2).contains("개새끼", "시발");

        // 2. 비속어가 없는 경우
        List<String> match3 = filter.findMatchedBadWords("착하고 성실한 학생입니다.");
        assertThat(match3).isEmpty();
    }
}
