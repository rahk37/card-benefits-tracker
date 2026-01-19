package com.cardbenefitstracker.dto;

import java.util.List;

public record CardBenefitsDto(
        Long cardId,
        String cardName,
        List<BenefitDto> benefits
) {
}
