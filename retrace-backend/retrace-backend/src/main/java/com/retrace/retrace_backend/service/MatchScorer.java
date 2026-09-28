package com.retrace.retrace_backend.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Pure weighted-field matching algorithm.
 *
 * Deliberately has zero dependencies on Spring, JPA, or Lombok so that the
 * single most important piece of business logic in this application can be
 * unit tested (and even compiled) in complete isolation from the rest of
 * the framework.
 *
 * Weights (out of 100):
 *   category    30
 *   subcategory 20
 *   brand       15
 *   model       15
 *   color       10
 *   location    10
 *
 * A field contributes its full weight only if BOTH sides have a non-blank
 * value AND those values are equal, case-insensitively, after trimming.
 * A missing/blank value on either side simply contributes 0 for that field
 * — it never throws and never partially credits a field.
 */
public final class MatchScorer {

    public static final int WEIGHT_CATEGORY = 30;
    public static final int WEIGHT_SUBCATEGORY = 20;
    public static final int WEIGHT_BRAND = 15;
    public static final int WEIGHT_MODEL = 15;
    public static final int WEIGHT_COLOR = 10;
    public static final int WEIGHT_LOCATION = 10;

    private MatchScorer() {
        // static utility class — not meant to be instantiated
    }

    /**
     * Result of comparing one lost item's fields against one found item's
     * fields: the total weighted score (0-100) and the list of field names
     * that actually matched.
     */
    public static final class Result {
        private final int score;
        private final List<String> matchedFields;

        public Result(int score, List<String> matchedFields) {
            this.score = score;
            this.matchedFields = Collections.unmodifiableList(matchedFields);
        }

        public int getScore() {
            return score;
        }

        public List<String> getMatchedFields() {
            return matchedFields;
        }
    }

    /**
     * Case-insensitive, whitespace-trimmed equality check that treats a
     * null or blank value on either side as "not comparable" rather than
     * throwing — exactly the "ignore null/empty fields instead of causing
     * errors" requirement.
     */
    static boolean fieldsMatch(String a, String b) {
        if (a == null || b == null) return false;
        String ta = a.trim();
        String tb = b.trim();
        if (ta.isEmpty() || tb.isEmpty()) return false;
        return ta.equalsIgnoreCase(tb);
    }

    public static Result score(
            String lostCategory, String lostSubcategory, String lostBrand, String lostModel, String lostColor, String lostLocation,
            String foundCategory, String foundSubcategory, String foundBrand, String foundModel, String foundColor, String foundLocation
    ) {
        int total = 0;
        List<String> matched = new ArrayList<>();

        if (fieldsMatch(lostCategory, foundCategory)) {
            total += WEIGHT_CATEGORY;
            matched.add("category");
        }
        if (fieldsMatch(lostSubcategory, foundSubcategory)) {
            total += WEIGHT_SUBCATEGORY;
            matched.add("subcategory");
        }
        if (fieldsMatch(lostBrand, foundBrand)) {
            total += WEIGHT_BRAND;
            matched.add("brand");
        }
        if (fieldsMatch(lostModel, foundModel)) {
            total += WEIGHT_MODEL;
            matched.add("model");
        }
        if (fieldsMatch(lostColor, foundColor)) {
            total += WEIGHT_COLOR;
            matched.add("color");
        }
        if (fieldsMatch(lostLocation, foundLocation)) {
            total += WEIGHT_LOCATION;
            matched.add("location");
        }

        return new Result(total, matched);
    }
}
