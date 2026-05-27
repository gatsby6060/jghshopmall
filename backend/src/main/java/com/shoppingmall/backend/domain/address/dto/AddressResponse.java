package com.shoppingmall.backend.domain.address.dto;

import com.shoppingmall.backend.domain.address.entity.Address;

public record AddressResponse(
        Long id,
        String alias,
        String receiverName,
        String receiverPhone,
        String zipCode,
        String address,
        String addressDetail,
        boolean isDefault
) {
    public static AddressResponse from(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getAlias(),
                address.getReceiverName(),
                address.getReceiverPhone(),
                address.getZipCode(),
                address.getAddress(),
                address.getAddressDetail(),
                address.isDefault()
        );
    }
}
