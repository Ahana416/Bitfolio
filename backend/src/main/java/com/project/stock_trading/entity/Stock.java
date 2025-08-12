package com.project.stock_trading.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "stocks")
@NoArgsConstructor
@AllArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticker")
    private String ticker;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "available_volume")
    private Integer availableVolume;

    @Column(name = "sector")
    private String sector;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getAvailableVolume() { return availableVolume; }
    public void setAvailableVolume(Integer availableVolume) { this.availableVolume = availableVolume; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

}