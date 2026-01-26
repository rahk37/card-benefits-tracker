package com.cardbenefitstracker.dto;

public record CatalogRewardCategoryDto(
        String category,
        String earnRate,
        Double rateValue,
        String notes,
        Double monthlyCap
) {
}
