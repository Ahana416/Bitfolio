package com.project.stock_trading.repository;

import com.project.stock_trading.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;



public interface StockRepository extends JpaRepository<Stock, Long> {

}
