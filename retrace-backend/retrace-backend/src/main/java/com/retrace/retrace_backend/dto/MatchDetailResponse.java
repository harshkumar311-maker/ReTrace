package com.retrace.retrace_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchDetailResponse {
    private ItemResponse lostItem;
    private List<MatchResult> matches;
}
