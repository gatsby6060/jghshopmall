package com.shoppingmall.backend.domain.address.service;

import com.shoppingmall.backend.domain.address.dto.AddressRequest;
import com.shoppingmall.backend.domain.address.dto.AddressResponse;
import com.shoppingmall.backend.domain.address.entity.Address;
import com.shoppingmall.backend.domain.address.repository.AddressRepository;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.domain.user.repository.UserRepository;
import com.shoppingmall.backend.global.exception.BusinessException;
import com.shoppingmall.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private static final int MAX_ADDRESS_COUNT = 10;

    /** 내 배송지 목록 조회 */
    public List<AddressResponse> getMyAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(AddressResponse::from)
                .toList();
    }

    /** 배송지 추가 */
    @Transactional
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자", userId));

        long count = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).size();
        if (count >= MAX_ADDRESS_COUNT) {
            throw new BusinessException("배송지는 최대 " + MAX_ADDRESS_COUNT + "개까지 등록 가능합니다.");
        }

        // 기본 배송지로 설정 요청 시, 기존 기본 배송지 해제
        if (request.isDefault()) {
            clearDefaultAddress(userId);
        }

        // 첫 번째 배송지는 자동으로 기본 배송지
        boolean shouldBeDefault = request.isDefault() || count == 0;

        Address address = Address.builder()
                .user(user)
                .alias(request.alias())
                .receiverName(request.receiverName())
                .receiverPhone(request.receiverPhone())
                .zipCode(request.zipCode())
                .address(request.address())
                .addressDetail(request.addressDetail())
                .isDefault(shouldBeDefault)
                .build();

        return AddressResponse.from(addressRepository.save(address));
    }

    /** 배송지 수정 */
    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = getAddressOwnedByUser(userId, addressId);

        if (request.isDefault()) {
            clearDefaultAddress(userId);
        }

        address.update(
                request.alias(),
                request.receiverName(),
                request.receiverPhone(),
                request.zipCode(),
                request.address(),
                request.addressDetail(),
                request.isDefault()
        );

        return AddressResponse.from(addressRepository.save(address));
    }

    /** 배송지 삭제 */
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = getAddressOwnedByUser(userId, addressId);
        addressRepository.delete(address);

        // 삭제 후 배송지가 남아있다면 첫번째를 기본으로 승격
        if (address.isDefault()) {
            addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                    .stream()
                    .findFirst()
                    .ifPresent(first -> first.setDefault(true));
        }
    }

    /** 기본 배송지 변경 */
    @Transactional
    public AddressResponse setDefaultAddress(Long userId, Long addressId) {
        Address address = getAddressOwnedByUser(userId, addressId);
        clearDefaultAddress(userId);
        address.setDefault(true);
        return AddressResponse.from(addressRepository.save(address));
    }

    // === 내부 헬퍼 ===

    private Address getAddressOwnedByUser(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("배송지", addressId));
        if (!address.getUser().getId().equals(userId)) {
            throw new BusinessException("본인의 배송지만 관리할 수 있습니다.");
        }
        return address;
    }

    private void clearDefaultAddress(Long userId) {
        addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(addr -> addr.setDefault(false));
    }
}
