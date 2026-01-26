package com.cardbenefitstracker.dto;

import java.util.List;

public record SimilarCardRecommendationDto(
        Long currentCardId,
        String currentCardName,
        Long alternativeCardId,
        String alternativeCardName,
        Integer annualFeeSavingsCents,
        List<String> sharedCategories,
        List<String> currentOnlyCategories,
        List<String> alternativeOnlyCategories,
        String reasoning
) {
}
