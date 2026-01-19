package com.cardbenefitstracker.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "credit_cards")
public class CreditCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String issuer;

    private String network;

    @Column(name = "annual_fee_cents", nullable = false)
    private Integer annualFeeCents;

    @Column(name = "is_business", nullable = false)
    private Boolean business;

    private String description;

    @OneToMany(mappedBy = "creditCard", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RewardCategory> rewardCategories = new ArrayList<>();

    @OneToMany(mappedBy = "creditCard", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Benefit> benefits = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getIssuer() {
        return issuer;
    }

    public String getNetwork() {
        return network;
    }

    public Integer getAnnualFeeCents() {
        return annualFeeCents;
    }

    public Boolean getBusiness() {
        return business;
    }

    public String getDescription() {
        return description;
    }

    public List<RewardCategory> getRewardCategories() {
        return rewardCategories;
    }

    public List<Benefit> getBenefits() {
        return benefits;
    }
}
