package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.MatchDetailResponse;
import com.retrace.retrace_backend.dto.MatchResult;

import java.util.List;

public interface MatchingService {

    List<MatchResult> findMatches(Long lostItemId);

    MatchDetailResponse getMatchDetails(Long lostItemId);

    long countAllPossibleMatches();
}