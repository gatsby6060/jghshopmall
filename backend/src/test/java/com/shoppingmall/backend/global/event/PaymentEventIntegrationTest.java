package com.shoppingmall.backend.global.event;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;

import org.springframework.test.context.ActiveProfiles;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@EmbeddedKafka(partitions = 1, bootstrapServersProperty = "spring.kafka.bootstrap-servers")
public class PaymentEventIntegrationTest {

    @Autowired
    private PaymentEventProducer paymentEventProducer;

    @Autowired
    private PaymentEventLogRepository paymentEventLogRepository;

    @Test
    public void testSendAndConsumePaymentEvent() throws InterruptedException {
        // Given
        String testOrderId = "TEST-ORDER-JUNIT-12345";
        Long testAmount = 99000L;
        String testEmail = "friend-advice@example.com";

        // When (카프카로 비동기 발송)
        paymentEventProducer.sendPaymentEvent(testOrderId, testAmount, testEmail);

        // Then (비동기 메시지가 내장 카프카를 거쳐 DB에 저장될 때까지 대기)
        Thread.sleep(3000);

        // 데이터베이스에서 카프카에 의해 영속화된 데이터 조회 검증 (친구 조언 적용)
        Optional<PaymentEventLog> savedLogOpt = paymentEventLogRepository.findByOrderId(testOrderId);
        
        assertThat(savedLogOpt).isPresent();
        PaymentEventLog savedLog = savedLogOpt.get();
        assertThat(savedLog.getOrderId()).isEqualTo(testOrderId);
        assertThat(savedLog.getAmount()).isEqualTo(testAmount);
        assertThat(savedLog.getEmail()).isEqualTo(testEmail);
        assertThat(savedLog.getReceivedAt()).isNotNull();
    }
}
