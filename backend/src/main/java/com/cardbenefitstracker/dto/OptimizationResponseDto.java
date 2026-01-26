package com.cardbenefitstracker.dto;

import java.util.List;

public record OptimizationResponseDto(
        List<CardSummaryDto> cardSummaries,
        List<CategoryWinnerDto> bestByCategory,
        List<RecommendationDto> topRecommendations,
        List<SimilarCardRecommendationDto> similarCardRecommendations,
        List<String> optimizationTips
) {
}
