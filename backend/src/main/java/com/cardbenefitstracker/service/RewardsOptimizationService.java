package com.cardbenefitstracker.service;

import com.cardbenefitstracker.dto.CardSummaryDto;
import com.cardbenefitstracker.dto.CategoryWinnerDto;
import com.cardbenefitstracker.dto.CategoryRewardDto;
import com.cardbenefitstracker.dto.CatalogCardDto;
import com.cardbenefitstracker.dto.CatalogRewardCategoryDto;
import com.cardbenefitstracker.dto.OptimizationRequestDto;
import com.cardbenefitstracker.dto.OptimizationResponseDto;
import com.cardbenefitstracker.dto.RecommendationDto;
import com.cardbenefitstracker.dto.SimilarCardRecommendationDto;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class RewardsOptimizationService {

    private static final double DEFAULT_RATE = 0.01;
    private static final String ESTIMATE_NOTE = "Estimated rate until audited data is imported.";

    public OptimizationResponseDto optimize(List<CatalogCardDto> selectedCards,
                                           List<CatalogCardDto> candidateCards,
                                           OptimizationRequestDto request) {
        Map<String, Double> baseSpend = request.monthlySpendByCategory() == null ? Map.of() : request.monthlySpendByCategory();
        Map<String, Double> spend = Boolean.TRUE.equals(request.household()) && request.householdSplit() != null
                ? mergeSpend(baseSpend, request.householdSplit())
                : baseSpend;
        List<CardSummaryDto> summaries = new ArrayList<>();

        for (CatalogCardDto card : selectedCards) {
            summaries.add(summarizeCard(ensureRewardData(card), spend));
        }

        List<CategoryWinnerDto> winners = spend.keySet().stream()
                .map(category -> bestCardForCategory(category, candidateCards))
                .filter(Objects::nonNull)
                .toList();

        List<RecommendationDto> recommendations = candidateCards.stream()
                .map(card -> summarizeCard(ensureRewardData(card), spend))
                .sorted(Comparator.comparing(CardSummaryDto::monthlyNetRewards).reversed())
                .limit(3)
                .map(summary -> new RecommendationDto(
                        summary.cardId(),
                        summary.cardName(),
                        summary.monthlyNetRewards(),
                        summary.yearlyNetRewards(),
                        buildReason(summary)
                ))
                .toList();

        List<SimilarCardRecommendationDto> similarCards = buildSimilarCardRecommendations(selectedCards, candidateCards);
        List<String> tips = buildTips(spend, winners);

        return new OptimizationResponseDto(summaries, winners, recommendations, similarCards, tips);
    }

    private Map<String, Double> mergeSpend(Map<String, Double> baseSpend, Map<String, Double> householdSpend) {
        Map<String, Double> merged = baseSpend == null ? new java.util.HashMap<>() : new java.util.HashMap<>(baseSpend);
        householdSpend.forEach((category, value) -> {
            double current = merged.getOrDefault(category, 0.0);
            merged.put(category, current + (value == null ? 0 : value));
        });
        return merged;
    }

    private CardSummaryDto summarizeCard(CatalogCardDto card, Map<String, Double> spend) {
        List<CategoryRewardDto> categoryRewards = new ArrayList<>();
        double monthlyRewards = 0;
        double coveredSpend = 0;
        List<CatalogRewardCategoryDto> rewards = card.rewardCategories() == null ? List.of() : card.rewardCategories();

        for (CatalogRewardCategoryDto rewardCategory : rewards) {
            double monthlySpend = spend.getOrDefault(rewardCategory.category(), 0.0);
            double cappedSpend = rewardCategory.monthlyCap() == null
                    ? monthlySpend
                    : Math.min(monthlySpend, rewardCategory.monthlyCap());
            double rate = rewardCategory.rateValue() == null ? DEFAULT_RATE : rewardCategory.rateValue();
            double monthlyReward = cappedSpend * rate;
            monthlyRewards += monthlyReward;
            coveredSpend += cappedSpend;
            categoryRewards.add(new CategoryRewardDto(
                    rewardCategory.category(),
                    monthlySpend,
                    rate,
                    rewardCategory.earnRate(),
                    monthlyReward,
                    rewardCategory.notes()
            ));
        }

        double totalSpend = spend.values().stream().mapToDouble(value -> value == null ? 0 : value).sum();
        double uncoveredSpend = Math.max(0, totalSpend - coveredSpend);
        if (uncoveredSpend > 0) {
            monthlyRewards += uncoveredSpend * DEFAULT_RATE;
        }

        double annualFeeMonthly = card.annualFeeCents() == null ? 0 : card.annualFeeCents() / 100.0 / 12.0;
        double monthlyNet = monthlyRewards - annualFeeMonthly;
        double yearlyNet = monthlyNet * 12;

        return new CardSummaryDto(
                card.id(),
                card.name(),
                card.issuer(),
                card.type(),
                card.annualFeeCents(),
                card.annualFee(),
                card.description(),
                card.imageUrl(),
                categoryRewards,
                monthlyRewards,
                monthlyRewards * 12,
                monthlyNet,
                yearlyNet
        );
    }

    private CategoryWinnerDto bestCardForCategory(String category, List<CatalogCardDto> cards) {
        CatalogCardDto bestCard = null;
        CatalogRewardCategoryDto bestCategory = null;
        double bestRate = -1;

        for (CatalogCardDto card : cards) {
            List<CatalogRewardCategoryDto> rewards = ensureRewardData(card).rewardCategories();
            for (CatalogRewardCategoryDto rewardCategory : rewards) {
                if (!category.equals(rewardCategory.category())) {
                    continue;
                }
                double rate = rewardCategory.rateValue() == null ? DEFAULT_RATE : rewardCategory.rateValue();
                if (rate > bestRate) {
                    bestRate = rate;
                    bestCard = card;
                    bestCategory = rewardCategory;
                }
            }
        }

        if (bestCard == null || bestCategory == null) {
            return null;
        }

        return new CategoryWinnerDto(
                category,
                bestCard.id(),
                bestCard.name(),
                bestCategory.rateValue(),
                bestCategory.earnRate(),
                bestCategory.notes(),
                bestCard.perks() == null ? List.of() : bestCard.perks()
        );
    }

    private List<SimilarCardRecommendationDto> buildSimilarCardRecommendations(List<CatalogCardDto> selectedCards,
                                                                              List<CatalogCardDto> candidateCards) {
        List<SimilarCardRecommendationDto> recommendations = new ArrayList<>();
        for (CatalogCardDto current : selectedCards) {
            CatalogCardDto best = null;
            int bestOverlap = 0;
            int bestSavings = 0;
            int currentFee = current.annualFeeCents() == null ? 0 : current.annualFeeCents();

            for (CatalogCardDto alternative : candidateCards) {
                if (alternative.id().equals(current.id())) {
                    continue;
                }
                int altFee = alternative.annualFeeCents() == null ? 0 : alternative.annualFeeCents();
                if (altFee >= currentFee) {
                    continue;
                }
                int overlap = countOverlap(current.categories(), alternative.categories());
                if (overlap == 0) {
                    continue;
                }
                int savings = currentFee - altFee;
                if (overlap > bestOverlap || (overlap == bestOverlap && savings > bestSavings)) {
                    best = alternative;
                    bestOverlap = overlap;
                    bestSavings = savings;
                }
            }

            if (best != null) {
                List<String> shared = intersectCategories(current.categories(), best.categories());
                List<String> currentOnly = diffCategories(current.categories(), best.categories());
                List<String> alternativeOnly = diffCategories(best.categories(), current.categories());
                recommendations.add(new SimilarCardRecommendationDto(
                        current.id(),
                        current.name(),
                        best.id(),
                        best.name(),
                        bestSavings,
                        shared,
                        currentOnly,
                        alternativeOnly,
                        "Similar coverage with lower annual fee."
                ));
            }
        }
        return recommendations;
    }

    private int countOverlap(List<String> first, List<String> second) {
        if (first == null || second == null) {
            return 0;
        }
        return (int) first.stream().filter(second::contains).count();
    }

    private List<String> intersectCategories(List<String> first, List<String> second) {
        if (first == null || second == null) {
            return List.of();
        }
        return first.stream().filter(second::contains).toList();
    }

    private List<String> diffCategories(List<String> source, List<String> compareTo) {
        if (source == null) {
            return List.of();
        }
        if (compareTo == null) {
            return source;
        }
        return source.stream().filter(category -> !compareTo.contains(category)).toList();
    }

    private CatalogCardDto ensureRewardData(CatalogCardDto card) {
        if (card.rewardCategories() != null && !card.rewardCategories().isEmpty()) {
            return card;
        }
        if (card.categories() == null || card.categories().isEmpty()) {
            return card;
        }
        List<CatalogRewardCategoryDto> fallback = card.categories().stream()
                .map(category -> new CatalogRewardCategoryDto(
                        category,
                        "1% (est.)",
                        DEFAULT_RATE,
                        ESTIMATE_NOTE,
                        null
                ))
                .toList();
        return new CatalogCardDto(
                card.id(),
                card.name(),
                card.issuer(),
                card.type(),
                card.annualFee(),
                card.annualFeeCents(),
                card.description(),
                card.imageUrl(),
                card.categories(),
                fallback,
                card.perks(),
                card.officialReference()
        );
    }

    private List<String> buildTips(Map<String, Double> spend, List<CategoryWinnerDto> winners) {
        List<String> tips = new ArrayList<>();
        if (winners.isEmpty()) {
            tips.add("Add spending by category to get personalized optimization tips.");
            return tips;
        }

        Map<String, String> bestByCategory = winners.stream()
                .collect(Collectors.toMap(CategoryWinnerDto::category, CategoryWinnerDto::cardName, (a, b) -> a));

        for (String category : spend.keySet()) {
            String bestCard = bestByCategory.get(category);
            if (bestCard != null) {
                tips.add("Use " + bestCard + " for " + category + " spending to maximize rewards.");
            }
        }

        return tips;
    }

    private String buildReason(CardSummaryDto summary) {
        List<CategoryRewardDto> topCategories = summary.categoryRewards().stream()
                .sorted(Comparator.comparing(CategoryRewardDto::monthlyReward).reversed())
                .limit(2)
                .toList();
        String topCategoryText = topCategories.isEmpty()
                ? "Steady rewards across categories"
                : topCategories.stream()
                        .filter(entry -> entry.monthlyReward() > 0)
                        .map(entry -> entry.category() + " (" + entry.earnRate() + ")")
                        .collect(Collectors.joining(", "));
        if (topCategoryText.isEmpty()) {
            topCategoryText = "Steady rewards across categories";
        }
        return "Estimated net rewards of $"
                + String.format("%.2f", summary.monthlyNetRewards())
                + "/month after annual fee. Strongest in " + topCategoryText + ".";
    }
}
