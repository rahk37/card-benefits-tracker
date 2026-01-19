package com.cardbenefitstracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reward_categories")
public class RewardCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private CreditCard creditCard;

    @Column(nullable = false)
    private String name;

    @Column(name = "earn_rate", nullable = false)
    private String earnRate;

    private String details;

    public Long getId() {
        return id;
    }

    public CreditCard getCreditCard() {
        return creditCard;
    }

    public String getName() {
        return name;
    }

    public String getEarnRate() {
        return earnRate;
    }

    public String getDetails() {
        return details;
    }
}
