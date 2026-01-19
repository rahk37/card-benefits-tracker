package com.cardbenefitstracker.repository;

import com.cardbenefitstracker.model.CreditCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {
}
