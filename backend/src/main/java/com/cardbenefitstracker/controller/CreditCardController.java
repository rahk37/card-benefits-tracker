package com.cardbenefitstracker.controller;

import com.cardbenefitstracker.dto.CardBenefitsDto;
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

    private final CreditCardService creditCardService;

    public CreditCardController(CreditCardService creditCardService) {
        this.creditCardService = creditCardService;
    }

    @GetMapping("/benefits")
    public List<CardBenefitsDto> getBenefitsForCards(@RequestParam(name = "cardIds") List<Long> cardIds) {
        if (cardIds == null || cardIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cardIds query parameter is required");
        }
        return creditCardService.getBenefitsForCards(cardIds);
    }
}
