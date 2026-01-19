package com.cardbenefitstracker.dto;

public record RewardCategoryDto(
        Long id,
        String name,
        String earnRate,
        String details
) {
}
