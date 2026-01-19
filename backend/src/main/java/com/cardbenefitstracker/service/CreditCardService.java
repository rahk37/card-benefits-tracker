package com.cardbenefitstracker.service;

import com.cardbenefitstracker.dto.BenefitDto;
import com.cardbenefitstracker.dto.CardBenefitsDto;
import com.cardbenefitstracker.dto.CreditCardDto;
import com.cardbenefitstracker.dto.RewardCategoryDto;
import com.cardbenefitstracker.model.Benefit;
import com.cardbenefitstracker.model.CreditCard;
import com.cardbenefitstracker.model.RewardCategory;
import com.cardbenefitstracker.repository.BenefitRepository;
import com.cardbenefitstracker.repository.CreditCardRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class CreditCardService {

    private final CreditCardRepository creditCardRepository;
    private final BenefitRepository benefitRepository;

    public CreditCardService(CreditCardRepository creditCardRepository, BenefitRepository benefitRepository) {
        this.creditCardRepository = creditCardRepository;
        this.benefitRepository = benefitRepository;
    }

    public List<CreditCardDto> getAllCards() {
        return creditCardRepository.findAll().stream()
                .map(this::toCreditCardDto)
                .toList();
    }

    public List<CardBenefitsDto> getBenefitsForCards(List<Long> cardIds) {
        List<Benefit> benefits = benefitRepository.findByCreditCardIdIn(cardIds);
        Map<Long, CardBenefitsDto> grouped = new LinkedHashMap<>();

        for (Benefit benefit : benefits) {
            CreditCard card = benefit.getCreditCard();
            CardBenefitsDto cardBenefits = grouped.computeIfAbsent(
                    card.getId(),
                    id -> new CardBenefitsDto(card.getId(), card.getName(), new ArrayList<>())
            );
            cardBenefits.benefits().add(toBenefitDto(benefit));
        }

        return new ArrayList<>(grouped.values());
    }

    private CreditCardDto toCreditCardDto(CreditCard card) {
        List<RewardCategoryDto> rewardCategories = card.getRewardCategories().stream()
                .map(this::toRewardCategoryDto)
                .collect(Collectors.toList());

        return new CreditCardDto(
                card.getId(),
                card.getName(),
                card.getIssuer(),
                card.getNetwork(),
                card.getAnnualFeeCents(),
                card.getBusiness(),
                card.getDescription(),
                rewardCategories
        );
    }

    private RewardCategoryDto toRewardCategoryDto(RewardCategory category) {
        return new RewardCategoryDto(
                category.getId(),
                category.getName(),
                category.getEarnRate(),
                category.getDetails()
        );
    }

    private BenefitDto toBenefitDto(Benefit benefit) {
        return new BenefitDto(
                benefit.getId(),
                benefit.getCreditCard().getId(),
                benefit.getType(),
                benefit.getName(),
                benefit.getDescription(),
                benefit.getValueCents(),
                benefit.getValueText()
        );
    }
}
