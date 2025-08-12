package com.project.stock_trading.controller;

import com.project.stock_trading.entity.Stock;
import com.project.stock_trading.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend React app
public class StockController {

    @Autowired
    private StockRepository stockRepository;

    // GET all stocks
    @GetMapping
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    // GET single stock by ID
    @GetMapping("/{id}")
    public Stock getStockById(@PathVariable Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));
    }

    // POST add new stock
    @PostMapping
    public Stock createStock(@RequestBody Stock stock) {
        return stockRepository.save(stock);
    }

    // PUT update existing stock
    @PutMapping("/{id}")
    public Stock updateStock(@PathVariable Long id, @RequestBody Stock stockDetails) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));

        stock.setTicker(stockDetails.getTicker());
        stock.setCompanyName(stockDetails.getCompanyName());
        stock.setPrice(stockDetails.getPrice());
        stock.setAvailableVolume(stockDetails.getAvailableVolume());
        stock.setSector(stockDetails.getSector());
        stock.setLastUpdated(stockDetails.getLastUpdated());

        return stockRepository.save(stock);
    }

    // DELETE stock
    @DeleteMapping("/{id}")
    public String deleteStock(@PathVariable Long id) {
        stockRepository.deleteById(id);
        return "Stock deleted successfully.";
    }
}
