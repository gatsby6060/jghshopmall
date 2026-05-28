package com.shoppingmall.backend.global.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final ObjectMapper objectMapper;
    private final PaymentEventLogRepository paymentEventLogRepository;

    @Transactional
    @KafkaListener(topics = "payment-events", groupId = "shoppingmall-group")
    public void consumePaymentEvent(String message) {
        log.info(" [Kafka Consumer 📥] 카프카로부터 원시 메시지를 수신했습니다: {}", message);
        try {
            PaymentEvent event = objectMapper.readValue(message, PaymentEvent.class);
            log.info("=========================================================================");
            log.info(" [Kafka Consumer 📢] 결제 완료 이벤트를 성공적으로 수신 및 해독했습니다!");
            log.info(" 👉 주문 번호 : {}", event.orderId());
            log.info(" 👉 결제 금액 : {}원", String.format("%,d", event.amount()));
            log.info(" 👉 고객 이메일: {}", event.email());
            
            // MariaDB 저장 (친구분의 조언 반영!)
            PaymentEventLog logEntity = PaymentEventLog.builder()
                    .orderId(event.orderId())
                    .amount(event.amount())
                    .email(event.email())
                    .build();
            paymentEventLogRepository.save(logEntity);
            log.info(" 💾 [MariaDB 영속화 💾] 결제 로그가 데이터베이스에 최종 저장되었습니다.");
            log.info("=========================================================================");
        } catch (JsonProcessingException e) {
            log.error(" [Kafka Consumer ❌] 수신한 메시지 역직렬화 중 에러 발생: ", e);
        }
    }
}
