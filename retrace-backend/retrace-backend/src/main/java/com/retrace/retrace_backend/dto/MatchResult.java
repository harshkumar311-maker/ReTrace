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
public class MatchResult {
    private Long lostItemId;
    private Long foundItemId;
    private int score;
    private List<String> matchedFields;
    private ItemResponse foundItem;
}
