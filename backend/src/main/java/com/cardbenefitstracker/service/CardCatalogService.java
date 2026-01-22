package com.cardbenefitstracker.service;

import com.cardbenefitstracker.dto.CatalogCardDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class CardCatalogService {

    private final ObjectMapper objectMapper;
    private List<CatalogCardDto> cachedCards = new ArrayList<>();

    public CardCatalogService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void loadCatalog() {
        ClassPathResource resource = new ClassPathResource("cards.json");
        try (InputStream inputStream = resource.getInputStream()) {
            cachedCards = objectMapper.readValue(inputStream, new TypeReference<>() {});
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to load cards catalog", exception);
        }
    }

    public List<CatalogCardDto> getAllCards() {
        return cachedCards;
    }
}
