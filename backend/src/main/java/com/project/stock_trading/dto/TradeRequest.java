package com.project.stock_trading.dto;

import lombok.Data;

@Data
public class TradeRequest {
    private String stockTicker;
    private java.math.BigDecimal price;
    private Integer volume;
    private String buyOrSell;
    private String sector;

    public TradeRequest() {}

    public TradeRequest(String stockTicker, java.math.BigDecimal price, Integer volume, String buyOrSell) {
        this.stockTicker = stockTicker;
        this.price = price;
        this.volume = volume;
        this.sector = sector;
        this.buyOrSell = buyOrSell;
    }

    public String getStockTicker() { return stockTicker; }
    public void setStockTicker(String stockTicker) { this.stockTicker = stockTicker; }

    public java.math.BigDecimal getPrice() { return price; }
    public void setPrice(java.math.BigDecimal price) { this.price = price; }

    public Integer getVolume() { return volume; }
    public void setVolume(Integer volume) { this.volume = volume; }

    public String getBuyOrSell() { return buyOrSell; }
    public void setBuyOrSell(String buyOrSell) { this.buyOrSell = buyOrSell; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

}