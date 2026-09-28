package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.ItemRequest;
import com.retrace.retrace_backend.dto.ItemResponse;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {

    ItemResponse createItem(
            ItemRequest request,
            ReportType reportType,
            List<MultipartFile> photos
    );

    ItemResponse getItemById(Long id);

    List<ItemResponse> getLostItems();

    List<ItemResponse> getFoundItems();

    List<ItemResponse> getMyLostItems();

    List<ItemResponse> getMyFoundItems();

    List<ItemResponse> getAllItems(
            String category,
            String subcategory,
            String brand,
            String color,
            String location,
            ItemStatus status,
            ReportType reportType
    );
}