package com.shoppingmall.backend.global.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventProducer {

    private static final String TOPIC = "payment-events";
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendPaymentEvent(String orderId, Long amount, String email) {
        PaymentEvent event = new PaymentEvent(orderId, amount, email);
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            log.info(" [Kafka Producer 📤] 결제 완료 이벤트를 카프카로 발행합니다. -> 토픽: {}, 메시지: {}", TOPIC, jsonMessage);
            
            kafkaTemplate.send(TOPIC, orderId, jsonMessage)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info(" [Kafka Producer 📤] 메시지가 성공적으로 카프카 브로커에 도달했습니다. Offset: {}", 
                                 result.getRecordMetadata().offset());
                    } else {
                        log.error(" [Kafka Producer ❌] 메시지 발행 실패: ", ex);
                    }
                });
        } catch (JsonProcessingException e) {
            log.error(" [Kafka Producer ❌] JSON 직렬화 중 에러 발생: ", e);
        }
    }
}
