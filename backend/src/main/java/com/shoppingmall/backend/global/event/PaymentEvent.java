package com.shoppingmall.backend.global.event;

import java.io.Serializable;

public record PaymentEvent(
    String orderId,
    Long amount,
    String email
) implements Serializable {}
