package com.cardbenefitstracker.dto;

public record CategoryRewardDto(
        String category,
        Double monthlySpend,
        Double rateValue,
        String earnRate,
        Double monthlyReward,
        String notes
) {
}
