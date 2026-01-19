package com.cardbenefitstracker.dto;

import java.util.List;

public record CreditCardDto(
        Long id,
        String name,
        String issuer,
        String network,
        Integer annualFeeCents,
        Boolean business,
        String description,
        List<RewardCategoryDto> rewardCategories
) {
}
