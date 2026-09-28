package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.ItemRequest;
import com.retrace.retrace_backend.dto.ItemResponse;
import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.entity.User;
import com.retrace.retrace_backend.exception.ItemNotFoundException;
import com.retrace.retrace_backend.repository.ItemRepository;
import com.retrace.retrace_backend.repository.ItemSpecifications;
import com.retrace.retrace_backend.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads", "items");

    public ItemServiceImpl(
            ItemRepository itemRepository,
            UserRepository userRepository
    ) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ItemResponse createItem(
            ItemRequest request,
            ReportType reportType,
            List<MultipartFile> photos
    ) {
        User currentUser = getCurrentUser();

        Item item = Item.builder()
                .reportType(reportType)
                .category(request.getCategory())
                .subcategory(request.getSubcategory())
                .brand(request.getBrand())
                .model(request.getModel())
                .color(request.getColor())
                .location(request.getLocation())
                .description(request.getDescription())
                .additionalDetails(request.getAdditionalDetails())
                .status(ItemStatus.ACTIVE)
                .owner(currentUser)
                .imageUrls(new ArrayList<>())
                .build();

        savePhotos(item, photos);

        Item saved = itemRepository.save(item);

        return ItemResponse.fromEntity(saved);
    }

    private void savePhotos(
            Item item,
            List<MultipartFile> photos
    ) {
        if (photos == null || photos.isEmpty()) {
            return;
        }

        try {
            Files.createDirectories(uploadDirectory);

            for (MultipartFile photo : photos) {

                if (photo == null || photo.isEmpty()) {
                    continue;
                }

                String originalName = photo.getOriginalFilename();

                if (originalName == null) {
                    continue;
                }

                String extension = "";

                int dotIndex = originalName.lastIndexOf(".");

                if (dotIndex >= 0) {
                    extension =
                            originalName.substring(dotIndex)
                                    .toLowerCase();
                }

                if (!extension.equals(".jpg")
                        && !extension.equals(".jpeg")
                        && !extension.equals(".png")
                        && !extension.equals(".webp")) {
                    continue;
                }

                String fileName =
                        UUID.randomUUID() + extension;

                Path target =
                        uploadDirectory.resolve(fileName);

                Files.copy(
                        photo.getInputStream(),
                        target,
                        StandardCopyOption.REPLACE_EXISTING
                );

                item.getImageUrls().add(
                        "/uploads/items/" + fileName
                );
            }

        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to save uploaded images",
                    e
            );
        }
    }

    @Override
    public ItemResponse getItemById(Long id) {

        Item item = itemRepository.findById(id)
                .orElseThrow(() ->
                        new ItemNotFoundException(id));

        return ItemResponse.fromEntity(item);
    }

    @Override
    public List<ItemResponse> getLostItems() {

        return itemRepository
                .findByReportType(ReportType.LOST)
                .stream()
                .map(ItemResponse::fromEntity)
                .toList();
    }

    @Override
    public List<ItemResponse> getFoundItems() {

        return itemRepository
                .findByReportType(ReportType.FOUND)
                .stream()
                .map(ItemResponse::fromEntity)
                .toList();
    }

    @Override
    public List<ItemResponse> getMyLostItems() {

        User currentUser = getCurrentUser();

        return itemRepository
                .findByOwnerAndReportType(
                        currentUser,
                        ReportType.LOST
                )
                .stream()
                .map(ItemResponse::fromEntity)
                .toList();
    }

    @Override
    public List<ItemResponse> getMyFoundItems() {

        User currentUser = getCurrentUser();

        return itemRepository
                .findByOwnerAndReportType(
                        currentUser,
                        ReportType.FOUND
                )
                .stream()
                .map(ItemResponse::fromEntity)
                .toList();
    }

    @Override
    public List<ItemResponse> getAllItems(
            String category,
            String subcategory,
            String brand,
            String color,
            String location,
            ItemStatus status,
            ReportType reportType
    ) {

        Specification<Item> spec = Specification
                .where(ItemSpecifications.hasCategory(category))
                .and(ItemSpecifications.hasSubcategory(subcategory))
                .and(ItemSpecifications.hasBrand(brand))
                .and(ItemSpecifications.hasColor(color))
                .and(ItemSpecifications.hasLocation(location))
                .and(ItemSpecifications.hasStatus(status))
                .and(ItemSpecifications.hasReportType(reportType));

        return itemRepository
                .findAll(spec)
                .stream()
                .map(ItemResponse::fromEntity)
                .toList();
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName() == null) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        ));
    }
}