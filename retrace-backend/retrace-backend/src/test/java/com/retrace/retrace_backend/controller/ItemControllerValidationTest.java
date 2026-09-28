package com.retrace.retrace_backend.controller;

import com.retrace.retrace_backend.repository.UserRepository;
import com.retrace.retrace_backend.service.ItemService;
import com.retrace.retrace_backend.service.JwtService;
import com.retrace.retrace_backend.service.MatchingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = ItemController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class
        }
)
@AutoConfigureMockMvc(addFilters = false)
@Import(ItemControllerValidationTest.TestConfig.class)
class ItemControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ItemService itemService;

    @MockBean
    private MatchingService matchingService;

    @MockBean
    private UserRepository userRepository;

    @TestConfiguration
    static class TestConfig {

        @Bean
        JwtService jwtService() {
            return new JwtService();
        }
    }

    @Test
    void reportingALostItemWithoutCategoryOrLocationReturnsFourHundredWithFieldErrors()
            throws Exception {

        String invalidPayload = """
                {
                  "subcategory": "Phone",
                  "brand": "Apple"
                }
                """;

        MockMultipartFile dataPart = new MockMultipartFile(
                "data",
                "",
                "application/json",
                invalidPayload.getBytes()
        );

        mockMvc.perform(
                        multipart("/api/items/lost")
                                .file(dataPart)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.category").exists())
                .andExpect(jsonPath("$.errors.location").exists());
    }

    @Test
    void reportingAFoundItemWithAllRequiredFieldsPassesValidation()
            throws Exception {

        String validPayload = """
                {
                  "category": "Electronics",
                  "subcategory": "Phone",
                  "brand": "Apple",
                  "model": "iPhone 15",
                  "color": "Blue",
                  "location": "Library",
                  "description": "Found near the reading room"
                }
                """;

        MockMultipartFile dataPart = new MockMultipartFile(
                "data",
                "",
                "application/json",
                validPayload.getBytes()
        );

        mockMvc.perform(
                        multipart("/api/items/found")
                                .file(dataPart)
                )
                .andExpect(status().isCreated());
    }
}