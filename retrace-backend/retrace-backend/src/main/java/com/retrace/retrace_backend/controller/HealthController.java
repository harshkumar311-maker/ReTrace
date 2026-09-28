package com.retrace.retrace_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/test")
    public Map<String, String> test() {
        return Map.of("message", "ReTrace Backend is Working!");
    }
}
