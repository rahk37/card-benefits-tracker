package com.cardbenefitstracker.dto;

public record RecommendationDto(
        Long cardId,
        String cardName,
        Double monthlyNetRewards,
        Double yearlyNetRewards,
        String reasoning
) {
}
