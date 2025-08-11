package com.project.stock_trading.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class PortfolioSummaryResponse {
    private BigDecimal totalInvestment;
    private long totalStocksPurchased;
    private Map<String, BigDecimal> sectorWiseInvestment;

    public PortfolioSummaryResponse(BigDecimal totalInvestment, long totalStocksPurchased, Map<String, BigDecimal> sectorWiseInvestment) {
        this.totalInvestment = totalInvestment;
        this.totalStocksPurchased = totalStocksPurchased;
        this.sectorWiseInvestment = sectorWiseInvestment; // Default to null if not provided
    }
    }

