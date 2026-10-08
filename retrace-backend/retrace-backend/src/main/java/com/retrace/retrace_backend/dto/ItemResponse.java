package com.retrace.retrace_backend.dto;

import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemResponse {

    private Long id;
    private ReportType reportType;

    private String title;
    private String category;
    private String subcategory;

    private String brand;
    private String model;
    private String color;

    private String location;
    private String date;
    private String time;

    private String description;
    private ItemStatus status;
    private String additionalDetails;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<String> imageUrls;

    public static ItemResponse fromEntity(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .reportType(item.getReportType())

                .title(item.getTitle())
                .category(item.getCategory())
                .subcategory(item.getSubcategory())

                .brand(item.getBrand())
                .model(item.getModel())
                .color(item.getColor())

                .location(item.getLocation())
                .date(item.getDate())
                .time(item.getTime())

                .description(item.getDescription())
                .status(item.getStatus())
                .additionalDetails(item.getAdditionalDetails())

                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())

                .imageUrls(item.getImageUrls())
                .build();
    }
}