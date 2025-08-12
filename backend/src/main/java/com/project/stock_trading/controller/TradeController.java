package com.project.stock_trading.controller;

import com.project.stock_trading.dto.PortfolioSummaryResponse;
import com.project.stock_trading.dto.TradeRequest;
import com.project.stock_trading.dto.TradeResponse;
import com.project.stock_trading.repository.TradeRepository;
import com.project.stock_trading.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/trades")

public class TradeController {

    private final TradeService tradeService;

    @Autowired
    public TradeController(TradeService tradeService) {
        this.tradeService = tradeService;
    }

    @PostMapping
    public TradeResponse createTrade(@RequestBody TradeRequest request) {
        return tradeService.createTrade(request);
    }

    @GetMapping
    public List<TradeResponse> getAllTrades() {
        return tradeService.getAllTrades();
    }

    @GetMapping("/{id}")
    public TradeResponse getTradeById(@PathVariable Long id) {
        return tradeService.getTradeById(id);
    }

    @GetMapping("/status/{statusCode}")
    public List<TradeResponse> getTradesByStatusCode(@PathVariable int statusCode) {
        return tradeService.getTradesByStatusCode(statusCode);
    }
    
    @GetMapping("/summary")
    public PortfolioSummaryResponse getPortfolioSummary() {
        return tradeService.getPortfolioSummary();
    }

    // Code for implementing our application using live stock price api



        //Method to fetch live stock price
        @GetMapping("/price/{symbol}")
        public Map<String, Object> getPrice(@PathVariable String symbol) {
            BigDecimal currentPrice = tradeService.getCurrentPrice(symbol);
            return Map.of("symbol", symbol, "price", currentPrice);
        }

        @Autowired
        private TradeRepository tradeRepository; // Inject repository instance

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteTrade(@PathVariable Long id) {
            if (tradeRepository.existsById(id)) {
                tradeRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        //TODO : Get this file from vaishnavi's git history / new file
        
        // @PostMapping("/trade")
        // public String placeTrade(@RequestBody TradeRequest request) {
        //     tradeService.executeTrade(request);
        //     return "Trade placed successfully!";
        // }

        
        
    }

// package com.project.stock_trading.controller;

// import com.project.stock_trading.dto.TradeRequest;
// import com.project.stock_trading.dto.TradeResponse;
// import com.project.stock_trading.service.TradeService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/trades")
// @RequiredArgsConstructor
// public class TradeController {

//     @Autowired
//     private final TradeService tradeService;

//     public TradeController(TradeService tradeService) {
//         this.tradeService = tradeService;
//     }

//     @PostMapping
//     public TradeResponse createTrade(@RequestBody TradeRequest request) {
//         return tradeService.createTrade(request);
//     }

//     @GetMapping
//     public List<TradeResponse> getAllTrades() {
//         return tradeService.getAllTrades();
//     }

//     @GetMapping("/{id}")
//     public TradeResponse getTradeById(@PathVariable Long id) {
//         return tradeService.getTradeById(id);
//     }

//     @GetMapping("/status/{statusCode}")
//     public List<TradeResponse> getTradesByStatusCode(@PathVariable int statusCode) {
//         return tradeService.getTradesByStatusCode(statusCode);
//     }
// }