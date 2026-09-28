package com.retrace.retrace_backend.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/images")
public class ImageController {

    private final Path uploadDirectory =
            Paths.get("uploads/items").toAbsolutePath().normalize();

    @GetMapping("/items/{filename:.+}")
    public ResponseEntity<Resource> getImage(
            @PathVariable String filename
    ) {
        try {
            Path filePath = uploadDirectory
                    .resolve(filename)
                    .normalize();

            // Prevent path traversal
            if (!filePath.startsWith(uploadDirectory)) {
                return ResponseEntity.badRequest().build();
            }

            Resource resource = new UrlResource(
                    filePath.toUri()
            );

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";

            String fileName = resource.getFilename();

            if (fileName != null) {
                String lowerName = fileName.toLowerCase();

                if (lowerName.endsWith(".png")) {
                    contentType = "image/png";
                } else if (
                        lowerName.endsWith(".jpg") ||
                        lowerName.endsWith(".jpeg")
                ) {
                    contentType = "image/jpeg";
                } else if (lowerName.endsWith(".webp")) {
                    contentType = "image/webp";
                }
            }

            return ResponseEntity.ok()
                    .contentType(
                            MediaType.parseMediaType(contentType)
                    )
                    .header(
                            HttpHeaders.CACHE_CONTROL,
                            "max-age=3600"
                    )
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}