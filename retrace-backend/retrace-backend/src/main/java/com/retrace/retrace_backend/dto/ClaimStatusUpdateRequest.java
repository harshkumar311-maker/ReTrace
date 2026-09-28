package com.retrace.retrace_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * status is accepted as a plain string (e.g. "APPROVED") and parsed against
 * {@link com.retrace.retrace_backend.entity.ClaimStatus} in the service
 * layer, so an invalid value produces a clean, handled error instead of a
 * framework-level deserialization failure.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClaimStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;
}
