package com.cardbenefitstracker.controller;

import com.cardbenefitstracker.dto.CardBenefitsDto;
import com.cardbenefitstracker.dto.CatalogCardDto;
import com.cardbenefitstracker.service.CardCatalogService;
import com.cardbenefitstracker.service.CreditCardService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class CreditCardController {

    private final CardCatalogService cardCatalogService;
    private final CreditCardService creditCardService;

    public CreditCardController(CardCatalogService cardCatalogService, CreditCardService creditCardService) {
        this.cardCatalogService = cardCatalogService;
        this.creditCardService = creditCardService;
    }

    @GetMapping("/cards")
    public List<CatalogCardDto> getAllCards() {
        return cardCatalogService.getAllCards();
    }

    @GetMapping("/benefits")
    public List<CardBenefitsDto> getBenefitsForCards(@RequestParam(name = "cardIds") List<Long> cardIds) {
        if (cardIds == null || cardIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cardIds query parameter is required");
        }
        return creditCardService.getBenefitsForCards(cardIds);
    }
}
