package com.cardbenefitstracker.dto;

import com.cardbenefitstracker.model.BenefitType;

public record BenefitDto(
        Long id,
        Long cardId,
        BenefitType type,
        String name,
        String description,
        Integer valueCents,
        String valueText
) {
}
