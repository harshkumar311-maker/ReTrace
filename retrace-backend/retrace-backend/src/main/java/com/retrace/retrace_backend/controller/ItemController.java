package com.retrace.retrace_backend.controller;

import com.retrace.retrace_backend.dto.ItemRequest;
import com.retrace.retrace_backend.dto.ItemResponse;
import com.retrace.retrace_backend.dto.MatchResult;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.service.ItemService;
import com.retrace.retrace_backend.service.MatchingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final MatchingService matchingService;

    public ItemController(
            ItemService itemService,
            MatchingService matchingService
    ) {
        this.itemService = itemService;
        this.matchingService = matchingService;
    }

    @PostMapping(
            value = "/lost",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<ItemResponse> reportLost(
            @Valid @RequestPart("data") ItemRequest request,
            @RequestPart(value = "photos", required = false)
            List<MultipartFile> photos
    ) {

        ItemResponse created =
                itemService.createItem(
                        request,
                        ReportType.LOST,
                        photos
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @PostMapping(
            value = "/found",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<ItemResponse> reportFound(
            @Valid @RequestPart("data") ItemRequest request,
            @RequestPart(value = "photos", required = false)
            List<MultipartFile> photos
    ) {

        ItemResponse created =
                itemService.createItem(
                        request,
                        ReportType.FOUND,
                        photos
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @GetMapping("/lost")
    public List<ItemResponse> getLostItems() {
        return itemService.getLostItems();
    }

    @GetMapping("/found")
    public List<ItemResponse> getFoundItems() {
        return itemService.getFoundItems();
    }

    @GetMapping("/my/lost")
    public List<ItemResponse> getMyLostItems() {
        return itemService.getMyLostItems();
    }

    @GetMapping("/my/found")
    public List<ItemResponse> getMyFoundItems() {
        return itemService.getMyFoundItems();
    }

    @GetMapping
    public List<ItemResponse> getAllItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) ReportType reportType
    ) {
        return itemService.getAllItems(
                category,
                subcategory,
                brand,
                color,
                location,
                status,
                reportType
        );
    }

    @GetMapping("/matches/{lostItemId}")
    public List<MatchResult> getMatches(
            @PathVariable Long lostItemId
    ) {
        return matchingService.findMatches(lostItemId);
    }

    @GetMapping("/{id}")
    public ItemResponse getItemById(
            @PathVariable Long id
    ) {
        return itemService.getItemById(id);
    }
}