package com.cardbenefitstracker.repository;

import com.cardbenefitstracker.model.Benefit;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BenefitRepository extends JpaRepository<Benefit, Long> {
    List<Benefit> findByCreditCardIdIn(List<Long> cardIds);
}
