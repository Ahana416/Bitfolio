package com.project.stock_trading.repository;

import com.project.stock_trading.entity.ExecutedTrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExecutedTradeRepository extends JpaRepository<ExecutedTrade, Long> {
    // You can add custom queries here if needed later
}
