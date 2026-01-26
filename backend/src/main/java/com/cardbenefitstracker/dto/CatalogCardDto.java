package com.cardbenefitstracker.dto;

import java.util.List;

public record CatalogCardDto(
        Long id,
        String name,
        String issuer,
        String type,
        String annualFee,
        Integer annualFeeCents,
        String description,
        String imageUrl,
        List<String> categories,
        List<CatalogRewardCategoryDto> rewardCategories,
        List<String> perks,
        String officialReference
) {
}
