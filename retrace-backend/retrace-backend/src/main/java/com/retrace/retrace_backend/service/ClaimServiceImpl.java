package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.ClaimRequest;
import com.retrace.retrace_backend.dto.ClaimResponse;
import com.retrace.retrace_backend.entity.Claim;
import com.retrace.retrace_backend.entity.ClaimStatus;
import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.entity.User;
import com.retrace.retrace_backend.exception.ClaimNotFoundException;
import com.retrace.retrace_backend.exception.InvalidClaimStatusException;
import com.retrace.retrace_backend.exception.InvalidItemOperationException;
import com.retrace.retrace_backend.exception.ItemNotFoundException;
import com.retrace.retrace_backend.repository.ClaimRepository;
import com.retrace.retrace_backend.repository.ItemRepository;
import com.retrace.retrace_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final Path handoverDirectory =
            Paths.get("uploads/handover").toAbsolutePath().normalize();

    public ClaimServiceImpl(
            ClaimRepository claimRepository,
            ItemRepository itemRepository,
            UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ClaimResponse createClaim(ClaimRequest request) {
        User currentUser = getCurrentUser();

        Item lostItem = itemRepository.findById(request.getLostItemId())
                .orElseThrow(() -> new ItemNotFoundException(request.getLostItemId()));
        Item foundItem = itemRepository.findById(request.getFoundItemId())
                .orElseThrow(() -> new ItemNotFoundException(request.getFoundItemId()));

        if (lostItem.getReportType() != ReportType.LOST) {
            throw new InvalidItemOperationException(
                    "Item " + lostItem.getId() + " is not a LOST item and cannot be used as lostItemId in a claim.");
        }
        if (foundItem.getReportType() != ReportType.FOUND) {
            throw new InvalidItemOperationException(
                    "Item " + foundItem.getId() + " is not a FOUND item and cannot be used as foundItemId in a claim.");
        }

        Claim claim = Claim.builder()
                .lostItemId(lostItem.getId())
                .foundItemId(foundItem.getId())
                .owner(currentUser)
                .claimantName(request.getClaimantName())
                .claimantEmail(request.getClaimantEmail())
                .message(request.getMessage())
                .status(ClaimStatus.PENDING)
                .build();

        return toResponse(claimRepository.save(claim), true);
    }

    @Override
    public ClaimResponse getClaimById(Long id) {
        Claim claim = findClaim(id);
        User currentUser = getCurrentUser();
        Item foundItem = getItem(claim.getFoundItemId());

        boolean allowed = isAdmin(currentUser)
                || sameUser(claim.getOwner(), currentUser)
                || sameUser(foundItem.getOwner(), currentUser);

        if (!allowed) {
            throw new RuntimeException("You are not allowed to view this claim");
        }

        return toResponse(claim, true);
    }

    @Override
    public List<ClaimResponse> getAllClaims() {
        return claimRepository.findAll()
                .stream()
                .map(claim -> toResponse(claim, true))
                .toList();
    }

    @Override
    public List<ClaimResponse> getMyClaims() {
        User currentUser = getCurrentUser();
        return claimRepository.findByOwner(currentUser)
                .stream()
                .map(claim -> toResponse(claim, true))
                .toList();
    }

    @Override
    public List<ClaimResponse> getMyActiveClaims() {
        User currentUser = getCurrentUser();
        return claimRepository.findByOwner(currentUser)
                .stream()
                .filter(claim -> claim.getStatus() == ClaimStatus.PENDING
                        || claim.getStatus() == ClaimStatus.APPROVED)
                .map(claim -> toResponse(claim, true))
                .toList();
    }

    @Override
    public List<ClaimResponse> getMyHandoverClaims() {
        User currentUser = getCurrentUser();

        return claimRepository.findAll()
                .stream()
                .filter(claim -> claim.getStatus() == ClaimStatus.APPROVED)
                .filter(claim -> {
                    Item foundItem = itemRepository.findById(claim.getFoundItemId()).orElse(null);
                    return foundItem != null && sameUser(foundItem.getOwner(), currentUser);
                })
                .map(claim -> toResponse(claim, false))
                .toList();
    }

    @Override
    @Transactional
    public ClaimResponse updateClaimStatus(Long id, String status) {
        Claim claim = findClaim(id);
        ClaimStatus parsed;

        try {
            parsed = ClaimStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new InvalidClaimStatusException(status);
        }

        claim.setStatus(parsed);

        // Approval means handover is now pending. The items become RECOVERED
        // only after the finder uploads the physical-handover proof photo.
        if (parsed == ClaimStatus.APPROVED) {
            Item lostItem = getItem(claim.getLostItemId());
            Item foundItem = getItem(claim.getFoundItemId());
            if (lostItem.getStatus() != ItemStatus.RECOVERED) {
                lostItem.setStatus(ItemStatus.MATCHED);
            }
            if (foundItem.getStatus() != ItemStatus.RECOVERED) {
                foundItem.setStatus(ItemStatus.MATCHED);
            }
            itemRepository.save(lostItem);
            itemRepository.save(foundItem);
        }

        return toResponse(claimRepository.save(claim), true);
    }

    @Override
    @Transactional
    public ClaimResponse uploadHandoverPhoto(Long id, MultipartFile photo) {
        User currentUser = getCurrentUser();
        Claim claim = findClaim(id);
        Item foundItem = getItem(claim.getFoundItemId());

        if (claim.getStatus() != ClaimStatus.APPROVED) {
            throw new InvalidItemOperationException("Handover photo can be uploaded only after claim approval.");
        }

        if (!sameUser(foundItem.getOwner(), currentUser)) {
            throw new InvalidItemOperationException("Only the finder who reported the found item can upload the handover photo.");
        }

        if (claim.getHandoverPhotoPath() != null) {
            throw new InvalidItemOperationException("The handover photo has already been uploaded.");
        }

        if (photo == null || photo.isEmpty()) {
            throw new InvalidItemOperationException("Exactly one handover photo is required.");
        }

        if (photo.getSize() > 10 * 1024 * 1024) {
            throw new InvalidItemOperationException("Handover photo must be 10 MB or smaller.");
        }

        String contentType = photo.getContentType() == null ? "" : photo.getContentType().toLowerCase();
        if (!(contentType.equals("image/jpeg")
                || contentType.equals("image/png")
                || contentType.equals("image/webp"))) {
            throw new InvalidItemOperationException("Only JPG, PNG or WEBP handover photos are allowed.");
        }

        try {
            Files.createDirectories(handoverDirectory);
            String extension = contentType.equals("image/png") ? ".png"
                    : contentType.equals("image/webp") ? ".webp" : ".jpg";
            String fileName = "claim-" + id + "-handover" + extension;
            Path target = handoverDirectory.resolve(fileName).normalize();

            if (!target.startsWith(handoverDirectory)) {
                throw new InvalidItemOperationException("Invalid handover photo path.");
            }

            Files.write(target, photo.getBytes());
            claim.setHandoverPhotoPath(target.toString());

            Item lostItem = getItem(claim.getLostItemId());
            lostItem.setStatus(ItemStatus.RECOVERED);
            foundItem.setStatus(ItemStatus.RECOVERED);
            itemRepository.save(lostItem);
            itemRepository.save(foundItem);

            return toResponse(claimRepository.save(claim), true);
        } catch (IOException ex) {
            throw new RuntimeException("Unable to save handover photo", ex);
        }
    }

    @Override
    public byte[] getHandoverPhoto(Long id) {
        User currentUser = getCurrentUser();
        Claim claim = findClaim(id);
        Item foundItem = getItem(claim.getFoundItemId());

        boolean allowed = isAdmin(currentUser)
                || sameUser(claim.getOwner(), currentUser)
                || sameUser(foundItem.getOwner(), currentUser);

        if (!allowed || claim.getHandoverPhotoPath() == null) {
            throw new RuntimeException("Handover photo is not available");
        }

        try {
            return Files.readAllBytes(Paths.get(claim.getHandoverPhotoPath()));
        } catch (IOException ex) {
            throw new RuntimeException("Unable to read handover photo", ex);
        }
    }

    private Claim findClaim(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ClaimNotFoundException(id));
    }

    private Item getItem(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));
    }

    private ClaimResponse toResponse(Claim claim, boolean includeFinderDetails) {
        ClaimResponse response = ClaimResponse.fromEntity(claim);
        if (includeFinderDetails && claim.getStatus() == ClaimStatus.APPROVED) {
            Item foundItem = itemRepository.findById(claim.getFoundItemId()).orElse(null);
            if (foundItem != null && foundItem.getOwner() != null) {
                User finder = foundItem.getOwner();
                response.setFinderName(finder.getName());
                response.setFinderEmail(finder.getEmail());
                response.setFinderPhone(finder.getPhone());
            }
        }
        return response;
    }

    private boolean sameUser(User a, User b) {
        return a != null && b != null && a.getId() != null && a.getId().equals(b.getId());
    }

    private boolean isAdmin(User user) {
        return user != null && user.getRole() == User.Role.ADMIN;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new RuntimeException("User is not authenticated");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}
