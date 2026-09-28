package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.AdminStatsResponse;
import com.retrace.retrace_backend.entity.ClaimStatus;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.repository.ClaimRepository;
import com.retrace.retrace_backend.repository.ItemRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminStatsService {

    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;
    private final MatchingService matchingService;

    public AdminStatsService(
            ItemRepository itemRepository,
            ClaimRepository claimRepository,
            MatchingService matchingService
    ) {
        this.itemRepository = itemRepository;
        this.claimRepository = claimRepository;
        this.matchingService = matchingService;
    }

    public AdminStatsResponse getStats() {

        long lostReports =
                itemRepository.countByReportType(ReportType.LOST);

        long foundReports =
                itemRepository.countByReportType(ReportType.FOUND);

        long totalReports =
                lostReports + foundReports;

        long possibleMatches =
                matchingService.countAllPossibleMatches();

        long successfulRecoveries =
                itemRepository.countByReportTypeAndStatus(
                        ReportType.LOST,
                        ItemStatus.RECOVERED
                );

        long pendingClaims =
                claimRepository.countByStatus(
                        ClaimStatus.PENDING
                );

        long flaggedReports = 0;

        return new AdminStatsResponse(
                totalReports,
                lostReports,
                foundReports,
                possibleMatches,
                successfulRecoveries,
                pendingClaims,
                flaggedReports
        );
    }
}