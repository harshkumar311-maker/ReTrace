package com.retrace.retrace_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Client-supplied fields for POST /api/items/lost and POST /api/items/found.
 * reportType, id, status, createdAt and updatedAt are never accepted from
 * the client — they're controlled entirely by the server.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequest {

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must be at most 100 characters")
    private String category;

    @NotBlank(message = "Subcategory is required")
    @Size(max = 100, message = "Subcategory must be at most 100 characters")
    private String subcategory;

    @Size(max = 100, message = "Brand must be at most 100 characters")
    private String brand;

    @Size(max = 100, message = "Model must be at most 100 characters")
    private String model;

    @Size(max = 50, message = "Color must be at most 50 characters")
    private String color;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must be at most 255 characters")
    private String location;

    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @Size(max = 4000, message = "Additional details must be at most 4000 characters")
    private String additionalDetails;
}
