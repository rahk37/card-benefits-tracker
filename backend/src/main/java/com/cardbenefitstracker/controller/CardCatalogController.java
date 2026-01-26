package com.cardbenefitstracker.controller;

import com.cardbenefitstracker.dto.CatalogCardDto;
import com.cardbenefitstracker.dto.OptimizationRequestDto;
import com.cardbenefitstracker.dto.OptimizationResponseDto;
import com.cardbenefitstracker.service.CardCatalogService;
import com.cardbenefitstracker.service.RewardsOptimizationService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CardCatalogController {

    private final CardCatalogService cardCatalogService;
    private final RewardsOptimizationService rewardsOptimizationService;

    public CardCatalogController(CardCatalogService cardCatalogService, RewardsOptimizationService rewardsOptimizationService) {
        this.cardCatalogService = cardCatalogService;
        this.rewardsOptimizationService = rewardsOptimizationService;
    }

    @GetMapping("/cards")
    public List<CatalogCardDto> getAllCards() {
        return cardCatalogService.getAllCards();
    }

    @PostMapping("/optimize")
    public OptimizationResponseDto optimize(@RequestBody OptimizationRequestDto request) {
        List<CatalogCardDto> allCards = cardCatalogService.getAllCards();
        List<Long> selectedIds = request.selectedCardIds() == null ? List.of() : request.selectedCardIds();
        List<CatalogCardDto> selectedCards = selectedIds.isEmpty()
                ? List.of()
                : allCards.stream()
                        .filter(card -> selectedIds.contains(card.id()))
                        .toList();
        List<CatalogCardDto> recommendationCards = allCards.stream()
                .filter(card -> !selectedIds.contains(card.id()))
                .filter(card -> selectedCards.stream()
                        .noneMatch(selected -> selected.name().equalsIgnoreCase(card.name())))
                .toList();
        return rewardsOptimizationService.optimize(selectedCards, recommendationCards, request);
    }
}
