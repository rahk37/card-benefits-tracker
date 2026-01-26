package com.cardbenefitstracker.dto;

import java.util.List;

public record CategoryWinnerDto(
        String category,
        Long cardId,
        String cardName,
        Double rateValue,
        String earnRate,
        String notes,
        List<String> perks
) {
}
