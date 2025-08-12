package com.project.stock_trading.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "executed_trades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutedTrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stockTicker;

    private BigDecimal price;

    private Integer volume;

    private String buyOrSell; // BUY or SELL

    private LocalDateTime executedAt;

    private int statusCode; // EXECUTED

    // Constructor to copy from Trade
    public ExecutedTrade(Trade trade) {
        this.stockTicker = trade.getStockTicker();
        this.price = trade.getPrice();
        this.volume = trade.getVolume();
        this.buyOrSell = trade.getBuyOrSell();
        this.executedAt = LocalDateTime.now();
        this.statusCode = 1;
    }
}
