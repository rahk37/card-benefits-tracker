package com.cardbenefitstracker.dto;

import java.util.List;

public record CardSummaryDto(
        Long cardId,
        String cardName,
        String issuer,
        String type,
        Integer annualFeeCents,
        String annualFee,
        String description,
        String imageUrl,
        List<CategoryRewardDto> categoryRewards,
        Double monthlyRewards,
        Double yearlyRewards,
        Double monthlyNetRewards,
        Double yearlyNetRewards
) {
}
