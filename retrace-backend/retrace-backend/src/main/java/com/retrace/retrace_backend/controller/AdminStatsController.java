package com.retrace.retrace_backend.controller;

import com.retrace.retrace_backend.dto.AdminStatsResponse;
import com.retrace.retrace_backend.service.AdminStatsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "*")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    public AdminStatsController(AdminStatsService adminStatsService) {
        this.adminStatsService = adminStatsService;
    }

    @GetMapping
    public AdminStatsResponse getStats() {
        return adminStatsService.getStats();
    }
}