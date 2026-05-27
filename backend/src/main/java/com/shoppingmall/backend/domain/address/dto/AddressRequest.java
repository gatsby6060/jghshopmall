package com.shoppingmall.backend.domain.address.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank(message = "별칭은 필수입니다.") @Size(max = 50) String alias,
        @NotBlank(message = "수령인 이름은 필수입니다.") @Size(max = 100) String receiverName,
        @NotBlank(message = "수령인 전화번호는 필수입니다.") @Pattern(regexp = "^0[0-9]{1,2}-[0-9]{3,4}-[0-9]{4}$", message = "올바른 전화번호 형식을 입력하세요.") String receiverPhone,
        @NotBlank(message = "우편번호는 필수입니다.") @Size(max = 10) String zipCode,
        @NotBlank(message = "주소는 필수입니다.") @Size(max = 200) String address,
        @Size(max = 200) String addressDetail,
        boolean isDefault
) {}
