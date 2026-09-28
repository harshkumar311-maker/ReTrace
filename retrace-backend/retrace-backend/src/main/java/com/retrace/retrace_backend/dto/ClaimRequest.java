package com.retrace.retrace_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClaimRequest {

    @NotNull(message = "lostItemId is required")
    private Long lostItemId;

    @NotNull(message = "foundItemId is required")
    private Long foundItemId;

    @NotBlank(message = "Claimant name is required")
    @Size(max = 150, message = "Claimant name must be at most 150 characters")
    private String claimantName;

    @NotBlank(message = "Claimant email is required")
    @Email(message = "Claimant email must be a valid email address")
    @Size(max = 150, message = "Claimant email must be at most 150 characters")
    private String claimantEmail;

    @Size(max = 2000, message = "Message must be at most 2000 characters")
    private String message;
}
