package com.retrace.retrace_backend.repository;

import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Each method returns a Specification that only adds a WHERE clause when
 * the given value is present — omitted/blank parameters are simply
 * ignored instead of failing or requiring separate query methods for
 * every combination of filters.
 */
public final class ItemSpecifications {

    private ItemSpecifications() {
    }

    public static Specification<Item> hasCategory(String category) {
        return (root, query, cb) -> StringUtils.hasText(category)
                ? cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase())
                : cb.conjunction();
    }

    public static Specification<Item> hasSubcategory(String subcategory) {
        return (root, query, cb) -> StringUtils.hasText(subcategory)
                ? cb.equal(cb.lower(root.get("subcategory")), subcategory.trim().toLowerCase())
                : cb.conjunction();
    }

    public static Specification<Item> hasBrand(String brand) {
        return (root, query, cb) -> StringUtils.hasText(brand)
                ? cb.equal(cb.lower(root.get("brand")), brand.trim().toLowerCase())
                : cb.conjunction();
    }

    public static Specification<Item> hasColor(String color) {
        return (root, query, cb) -> StringUtils.hasText(color)
                ? cb.equal(cb.lower(root.get("color")), color.trim().toLowerCase())
                : cb.conjunction();
    }

    public static Specification<Item> hasLocation(String location) {
        return (root, query, cb) -> StringUtils.hasText(location)
                ? cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase() + "%")
                : cb.conjunction();
    }

    public static Specification<Item> hasStatus(ItemStatus status) {
        return (root, query, cb) -> status != null
                ? cb.equal(root.get("status"), status)
                : cb.conjunction();
    }

    public static Specification<Item> hasReportType(ReportType reportType) {
        return (root, query, cb) -> reportType != null
                ? cb.equal(root.get("reportType"), reportType)
                : cb.conjunction();
    }
}
