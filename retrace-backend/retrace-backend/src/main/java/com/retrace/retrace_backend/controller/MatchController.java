package com.retrace.retrace_backend.controller;

import com.retrace.retrace_backend.dto.MatchDetailResponse;
import com.retrace.retrace_backend.service.MatchingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * A second, "clean" way to fetch match information for a lost item,
 * returning the lost item's own details alongside its ranked matches in
 * one payload — handy for a match-detail screen that needs both.
 * GET /api/items/matches/{lostItemId} (ItemController) returns just the
 * list of matches and remains the primary endpoint described in the spec.
 */
@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchingService matchingService;

    public MatchController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/{lostItemId}")
    public MatchDetailResponse getMatchDetails(@PathVariable Long lostItemId) {
        return matchingService.getMatchDetails(lostItemId);
    }
}
