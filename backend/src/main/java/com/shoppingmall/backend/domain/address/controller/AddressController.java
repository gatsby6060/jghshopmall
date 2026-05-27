package com.shoppingmall.backend.domain.address.controller;

import com.shoppingmall.backend.domain.address.dto.AddressRequest;
import com.shoppingmall.backend.domain.address.dto.AddressResponse;
import com.shoppingmall.backend.domain.address.service.AddressService;
import com.shoppingmall.backend.domain.user.entity.User;
import com.shoppingmall.backend.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    /** 내 배송지 목록 조회 */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getMyAddresses(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(addressService.getMyAddresses(user.getId())));
    }

    /** 배송지 추가 */
    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal User user) {
        AddressResponse response = addressService.addAddress(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("배송지가 추가되었습니다.", response));
    }

    /** 배송지 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal User user) {
        AddressResponse response = addressService.updateAddress(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("배송지가 수정되었습니다.", response));
    }

    /** 배송지 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        addressService.deleteAddress(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("배송지가 삭제되었습니다."));
    }

    /** 기본 배송지 변경 */
    @PatchMapping("/{id}/default")
    public ResponseEntity<ApiResponse<AddressResponse>> setDefaultAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        AddressResponse response = addressService.setDefaultAddress(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("기본 배송지가 변경되었습니다.", response));
    }
}
