package com.retrace.retrace_backend.service;

import com.retrace.retrace_backend.dto.MatchResult;
import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.exception.InvalidItemOperationException;
import com.retrace.retrace_backend.exception.ItemNotFoundException;
import com.retrace.retrace_backend.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchingServiceImplTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private MatchingServiceImpl matchingService;

    @BeforeEach
    void setThreshold() {
        // @Value isn't processed outside a Spring context, so set it directly
        // to the same default used in application.properties.
        ReflectionTestUtils.setField(matchingService, "matchThreshold", 50);
    }

    private Item item(Long id, ReportType type, ItemStatus status, String category, String subcategory,
                       String brand, String model, String color, String location) {
        return Item.builder()
                .id(id).reportType(type).status(status)
                .category(category).subcategory(subcategory).brand(brand).model(model)
                .color(color).location(location)
                .build();
    }

    @Test
    void returnsOnlyMatchesAtOrAboveThresholdSortedByScoreDescending() {
        Item lost = item(1L, ReportType.LOST, ItemStatus.ACTIVE,
                "Electronics", "Phone", "Apple", "iPhone 15", "Blue", "Library");

        Item strongMatch = item(2L, ReportType.FOUND, ItemStatus.ACTIVE,
                "Electronics", "Phone", "Apple", "iPhone 15", "Blue", "Library"); // 100
        Item weakMatch = item(3L, ReportType.FOUND, ItemStatus.ACTIVE,
                "Electronics", "Tablet", "Samsung", "Tab S9", "Black", "Cafeteria"); // category only = 30, below threshold

        when(itemRepository.findById(1L)).thenReturn(Optional.of(lost));
        when(itemRepository.findByReportTypeAndStatus(ReportType.FOUND, ItemStatus.ACTIVE))
                .thenReturn(List.of(weakMatch, strongMatch));

        List<MatchResult> results = matchingService.findMatches(1L);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getFoundItemId()).isEqualTo(2L);
        assertThat(results.get(0).getScore()).isEqualTo(100);
    }

    @Test
    void throwsItemNotFoundForUnknownLostItemId() {
        when(itemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> matchingService.findMatches(99L))
                .isInstanceOf(ItemNotFoundException.class);
    }

    @Test
    void rejectsMatchingAgainstAnItemThatIsNotALostReport() {
        Item foundItem = item(5L, ReportType.FOUND, ItemStatus.ACTIVE,
                "Electronics", "Phone", "Apple", "iPhone 15", "Blue", "Library");
        when(itemRepository.findById(5L)).thenReturn(Optional.of(foundItem));

        assertThatThrownBy(() -> matchingService.findMatches(5L))
                .isInstanceOf(InvalidItemOperationException.class);
    }

    @Test
    void onlyActiveFoundItemsAreConsideredForMatching() {
        Item lost = item(1L, ReportType.LOST, ItemStatus.ACTIVE,
                "Keys", "Keychain", null, null, "Silver", "Mall");

        when(itemRepository.findById(1L)).thenReturn(Optional.of(lost));
        // The repository call itself is scoped to ACTIVE found items only —
        // verifying we ask for exactly that combination.
        when(itemRepository.findByReportTypeAndStatus(ReportType.FOUND, ItemStatus.ACTIVE))
                .thenReturn(List.of());

        List<MatchResult> results = matchingService.findMatches(1L);

        assertThat(results).isEmpty();
    }
}
