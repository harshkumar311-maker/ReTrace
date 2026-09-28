package com.retrace.retrace_backend.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MatchScorerTest {

    @Test
    void exactMatchOnAllFieldsScoresOneHundred() {
        MatchScorer.Result result = MatchScorer.score(
                "Electronics", "Phone", "Apple", "iPhone 15", "Blue", "Library",
                "Electronics", "Phone", "Apple", "iPhone 15", "Blue", "Library"
        );

        assertThat(result.getScore()).isEqualTo(100);
        assertThat(result.getMatchedFields())
                .containsExactlyInAnyOrder("category", "subcategory", "brand", "model", "color", "location");
    }

    @Test
    void matchingOnlyCategorySubcategoryAndBrandScoresSixtyFive() {
        MatchScorer.Result result = MatchScorer.score(
                "Electronics", "Phone", "Apple", "iPhone 15", "Blue", "Library",
                "Electronics", "Phone", "Apple", "iPhone 14", "Black", "Cafeteria"
        );

        assertThat(result.getScore()).isEqualTo(65);
        assertThat(result.getMatchedFields()).containsExactlyInAnyOrder("category", "subcategory", "brand");
    }

    @Test
    void matchingIsCaseInsensitiveAndTrimsWhitespace() {
        MatchScorer.Result result = MatchScorer.score(
                "Electronics", "Phone", "Apple", "iPhone 15", "Blue", "Library",
                "  electronics  ", " PHONE", "apple", "IPHONE 15", "BLUE", "library "
        );

        assertThat(result.getScore()).isEqualTo(100);
    }

    @Test
    void nullOrBlankFieldsAreIgnoredRatherThanThrowingOrPartiallyMatching() {
        MatchScorer.Result result = MatchScorer.score(
                "Bags", "Backpack", null, "", "Grey", "Food Court",
                "Bags", "Backpack", null, null, "Grey", "Food Court"
        );

        assertThat(result.getScore()).isEqualTo(30 + 20 + 10 + 10); // category + subcategory + color + location
        assertThat(result.getMatchedFields()).doesNotContain("brand", "model");
    }

    @Test
    void completelyDifferentItemsScoreZero() {
        MatchScorer.Result result = MatchScorer.score(
                "Electronics", "Phone", "Apple", "iPhone 15", "Blue", "Library",
                "Jewelry", "Ring", "Tanishq", "Solitaire", "Gold", "Mall"
        );

        assertThat(result.getScore()).isZero();
        assertThat(result.getMatchedFields()).isEmpty();
    }

    @Test
    void repeatedIdenticalModelStringsMatchRegardlessOfBrandFormat() {
        // Mirrors the "HP Victus RTX2050" example from the spec: identical
        // free-text model strings should match even though model isn't a
        // controlled vocabulary field.
        MatchScorer.Result result = MatchScorer.score(
                "Electronics", "Laptop", "HP", "Victus RTX2050", "Black", "Hostel",
                "electronics", "laptop", "hp", "victus rtx2050", "black", "hostel"
        );

        assertThat(result.getScore()).isEqualTo(100);
    }
}
