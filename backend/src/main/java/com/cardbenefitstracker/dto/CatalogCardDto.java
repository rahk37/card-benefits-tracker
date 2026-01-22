package com.cardbenefitstracker.dto;

import java.util.List;

public record CatalogCardDto(
        Long id,
        String name,
        String issuer,
        String type,
        String annualFee,
        String description,
        String imageUrl,
        List<String> categories
) {
}
