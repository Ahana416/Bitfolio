package com.project.stock_trading.controller;

import com.project.stock_trading.dto.PortfolioSummaryResponse;
import com.project.stock_trading.dto.TradeRequest;
import com.project.stock_trading.dto.TradeResponse;
import com.project.stock_trading.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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