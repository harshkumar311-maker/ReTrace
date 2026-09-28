package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.ClaimRequest;
import com.retrace.retrace_backend.dto.ClaimResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ClaimService {

    ClaimResponse createClaim(ClaimRequest request);

    ClaimResponse getClaimById(Long id);

    List<ClaimResponse> getAllClaims();

    List<ClaimResponse> getMyClaims();

    List<ClaimResponse> getMyActiveClaims();

    List<ClaimResponse> getMyHandoverClaims();

    ClaimResponse updateClaimStatus(Long id, String status);

    ClaimResponse uploadHandoverPhoto(Long id, MultipartFile photo);

    byte[] getHandoverPhoto(Long id);
}
