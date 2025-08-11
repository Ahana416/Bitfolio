package com.project.stock_trading.dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class TradeResponse {
    private Long id;
    private String stockTicker;
    private BigDecimal price;
    private Integer volume;
    private String buyOrSell;
    private Integer statusCode;
    private LocalDateTime timestamp;
    private String sector;

    public TradeResponse(Long id, String stockTicker, BigDecimal price, Integer volume, String buyOrSell, Integer statusCode, LocalDateTime timestamp, String string) {
        this.id = id;
        this.stockTicker = stockTicker;
        this.price = price;
        this.volume = volume;
        this.buyOrSell = buyOrSell;
        this.statusCode = statusCode;
        this.timestamp = timestamp;
        this.sector = string; // Assuming 'string' is the sector
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStockTicker() { return stockTicker; }
    public void setStockTicker(String stockTicker) { this.stockTicker = stockTicker; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getVolume() { return volume; }
    public void setVolume(Integer volume) { this.volume = volume; }

    public String getBuyOrSell() { return buyOrSell; }
    public void setBuyOrSell(String buyOrSell) { this.buyOrSell = buyOrSell; }

    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }


    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

}