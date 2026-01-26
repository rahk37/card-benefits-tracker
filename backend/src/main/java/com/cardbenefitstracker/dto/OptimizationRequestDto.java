package com.cardbenefitstracker.dto;

import java.util.List;
import java.util.Map;

public record OptimizationRequestDto(
        List<Long> selectedCardIds,
        Map<String, Double> monthlySpendByCategory,
        Boolean household,
        Map<String, Double> householdSplit,
        Boolean includeAllCards
) {
}
