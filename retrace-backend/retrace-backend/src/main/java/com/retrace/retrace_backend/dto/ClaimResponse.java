package com.retrace.retrace_backend.dto;

import com.retrace.retrace_backend.entity.Claim;
import com.retrace.retrace_backend.entity.ClaimStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponse {

    private Long id;
    private Long lostItemId;
    private Long foundItemId;
    private String claimantName;
    private String claimantEmail;
    private String message;
    private ClaimStatus status;
    private LocalDateTime createdAt;
    private String finderName;
    private String finderEmail;
    private String finderPhone;
    private boolean handoverPhotoUploaded;

    public static ClaimResponse fromEntity(Claim claim) {
        return ClaimResponse.builder()
                .id(claim.getId())
                .lostItemId(claim.getLostItemId())
                .foundItemId(claim.getFoundItemId())
                .claimantName(claim.getClaimantName())
                .claimantEmail(claim.getClaimantEmail())
                .message(claim.getMessage())
                .status(claim.getStatus())
                .createdAt(claim.getCreatedAt())
                .handoverPhotoUploaded(claim.getHandoverPhotoPath() != null)
                .build();
    }
}
