package com.project.stock_trading.repository;

import com.project.stock_trading.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Long> {
    List<Trade> findByStatusCode(int statusCode);

    // List<Trade> findByBuyOrSell(String buyOrSell);
}
