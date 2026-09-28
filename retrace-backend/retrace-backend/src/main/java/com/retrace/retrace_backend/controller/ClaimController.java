package com.retrace.retrace_backend.controller;

import com.retrace.retrace_backend.dto.ClaimRequest;
import com.retrace.retrace_backend.dto.ClaimResponse;
import com.retrace.retrace_backend.dto.ClaimStatusUpdateRequest;
import com.retrace.retrace_backend.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175"
        },
        methods = {
                org.springframework.web.bind.annotation.RequestMethod.GET,
                org.springframework.web.bind.annotation.RequestMethod.POST,
                org.springframework.web.bind.annotation.RequestMethod.PATCH,
                org.springframework.web.bind.annotation.RequestMethod.OPTIONS
        }
)
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ResponseEntity<ClaimResponse> createClaim(
            @Valid @RequestBody ClaimRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(claimService.createClaim(request));
    }

    @GetMapping("/{id}")
    public ClaimResponse getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id);
    }

    @GetMapping
    public List<ClaimResponse> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/my")
    public List<ClaimResponse> getMyClaims() {
        return claimService.getMyClaims();
    }

    @GetMapping("/my/active")
    public List<ClaimResponse> getMyActiveClaims() {
        return claimService.getMyActiveClaims();
    }

    @GetMapping("/my/handover")
    public List<ClaimResponse> getMyHandoverClaims() {
        return claimService.getMyHandoverClaims();
    }

    @PatchMapping("/{id}/status")
    public ClaimResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ClaimStatusUpdateRequest request) {
        return claimService.updateClaimStatus(id, request.getStatus());
    }

    @PostMapping(
            value = "/{id}/handover",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ClaimResponse uploadHandoverPhoto(
            @PathVariable Long id,
            @RequestPart("photo") MultipartFile photo) {
        return claimService.uploadHandoverPhoto(id, photo);
    }

    @GetMapping("/{id}/handover-photo")
    public ResponseEntity<ByteArrayResource> getHandoverPhoto(
            @PathVariable Long id) {
        byte[] bytes = claimService.getHandoverPhoto(id);

        MediaType mediaType = MediaType.IMAGE_JPEG;
        if (bytes.length > 8 && bytes[0] == (byte) 0x89 && bytes[1] == 0x50) {
            mediaType = MediaType.IMAGE_PNG;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(new ByteArrayResource(bytes));
    }
}
