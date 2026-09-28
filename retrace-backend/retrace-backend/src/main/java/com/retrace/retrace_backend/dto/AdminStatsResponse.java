package com.retrace.retrace_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalReports;
    private long lostReports;
    private long foundReports;
    private long possibleMatches;
    private long successfulRecoveries;
    private long pendingClaims;
    private long flaggedReports;
}