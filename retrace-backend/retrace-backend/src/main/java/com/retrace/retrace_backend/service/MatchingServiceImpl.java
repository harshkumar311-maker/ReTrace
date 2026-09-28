package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.ItemResponse;
import com.retrace.retrace_backend.dto.MatchDetailResponse;
import com.retrace.retrace_backend.dto.MatchResult;
import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.exception.InvalidItemOperationException;
import com.retrace.retrace_backend.exception.ItemNotFoundException;
import com.retrace.retrace_backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class MatchingServiceImpl implements MatchingService {

    private final ItemRepository itemRepository;

    /**
     * Minimum score (0-100) a found item must reach to be returned as a
     * possible match. Configurable via retrace.matching.threshold in
     * application.properties so it can be tuned without touching code.
     */
    @Value("${retrace.matching.threshold:50}")
    private int matchThreshold;

    public MatchingServiceImpl(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public List<MatchResult> findMatches(Long lostItemId) {

        Item lost = itemRepository.findById(lostItemId)
                .orElseThrow(() -> new ItemNotFoundException(lostItemId));

        if (lost.getReportType() != ReportType.LOST) {
            throw new InvalidItemOperationException(
                    "Item " + lostItemId + " is a " + lost.getReportType()
                            + " report, not a LOST report. "
                            + "Matches can only be generated starting from a LOST item."
            );
        }

        List<Item> activeFoundItems =
                itemRepository.findByReportTypeAndStatus(
                        ReportType.FOUND,
                        ItemStatus.ACTIVE
                );

        return activeFoundItems.stream()
                .map(found -> toMatchResult(lost, found))
                .filter(match -> match.getScore() >= matchThreshold)
                .sorted(
                        Comparator.comparingInt(
                                MatchResult::getScore
                        ).reversed()
                )
                .toList();
    }

    @Override
    public MatchDetailResponse getMatchDetails(Long lostItemId) {

        Item lost = itemRepository.findById(lostItemId)
                .orElseThrow(() -> new ItemNotFoundException(lostItemId));

        List<MatchResult> matches = findMatches(lostItemId);

        return MatchDetailResponse.builder()
                .lostItem(ItemResponse.fromEntity(lost))
                .matches(matches)
                .build();
    }

    @Override
    public long countAllPossibleMatches() {

        List<Item> lostItems =
                itemRepository.findByReportType(ReportType.LOST);

        return lostItems.stream()
                .mapToLong(
                        lostItem ->
                                findMatches(lostItem.getId()).size()
                )
                .sum();
    }

    private MatchResult toMatchResult(
            Item lost,
            Item found
    ) {

        MatchScorer.Result result = MatchScorer.score(
                lost.getCategory(),
                lost.getSubcategory(),
                lost.getBrand(),
                lost.getModel(),
                lost.getColor(),
                lost.getLocation(),

                found.getCategory(),
                found.getSubcategory(),
                found.getBrand(),
                found.getModel(),
                found.getColor(),
                found.getLocation()
        );

        return MatchResult.builder()
                .lostItemId(lost.getId())
                .foundItemId(found.getId())
                .score(result.getScore())
                .matchedFields(result.getMatchedFields())
                .foundItem(ItemResponse.fromEntity(found))
                .build();
    }
}