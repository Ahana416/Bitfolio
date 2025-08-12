package com.project.stock_trading.service;

import com.project.stock_trading.dto.PortfolioSummaryResponse;
import com.project.stock_trading.dto.TradeRequest;
import com.project.stock_trading.dto.TradeResponse;
import com.project.stock_trading.entity.Trade;
import com.project.stock_trading.repository.TradeRepository;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TradeService {

    private final TradeRepository tradeRepository;

    public TradeService(TradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    public TradeResponse createTrade(TradeRequest request) {
        Trade trade = new Trade();
        trade.setStockTicker(request.getStockTicker());
        trade.setPrice(request.getPrice());
        trade.setVolume(request.getVolume());
        trade.setBuyOrSell(request.getBuyOrSell());
        trade.setStatusCode(0); // Pending
        trade.setTimestamp(LocalDateTime.now());
        trade.setSector(request.getSector()); // Set sector from request

        Trade saved = tradeRepository.save(trade);

        return new TradeResponse(
                saved.getId(),
                saved.getStockTicker(),
                saved.getPrice(),
                saved.getVolume(),
                saved.getBuyOrSell(),
                saved.getStatusCode(),
                saved.getTimestamp(),
                trade.getSector()
        );
    }

    public List<TradeResponse> getAllTrades() {
        return tradeRepository.findAll().stream().map(trade ->
                new TradeResponse(
                        trade.getId(),
                        trade.getStockTicker(),
                        trade.getPrice(),
                        trade.getVolume(),
                        trade.getBuyOrSell(),
                        trade.getStatusCode(),
                        trade.getTimestamp(),
                        trade.getSector()
                )
        ).collect(Collectors.toList());
    }

    public TradeResponse getTradeById(Long id) {
        Trade trade = tradeRepository.findById(id).orElseThrow();
        return new TradeResponse(
                trade.getId(),
                trade.getStockTicker(),
                trade.getPrice(),
                trade.getVolume(),
                trade.getBuyOrSell(),
                trade.getStatusCode(),
                trade.getTimestamp(),
                trade.getSector()
        );
    }

    public List<TradeResponse> getTradesByStatusCode(int statusCode) {

        return tradeRepository.findByStatusCode(statusCode).stream().map(trade ->
                new TradeResponse(
                        trade.getId(),
                        trade.getStockTicker(),
                        trade.getPrice(),
                        trade.getVolume(),
                        trade.getBuyOrSell(),
                        trade.getStatusCode(),
                        trade.getTimestamp(),
                        trade.getSector()
                )
        ).collect(Collectors.toList());
    }

    
//     public PortfolioSummaryResponse getPortfolioSummary() {
//     List<Trade> trades = tradeRepository.findAll();

//     BigDecimal totalInvestment = trades.stream()
//             .filter(t -> "BUY".equalsIgnoreCase(t.getBuyOrSell()))
//             .map(t -> t.getPrice().multiply(BigDecimal.valueOf(t.getVolume())))
//             .reduce(BigDecimal.ZERO, BigDecimal::add);

//     long totalStocksPurchased = trades.stream()
//             .filter(t -> "BUY".equalsIgnoreCase(t.getBuyOrSell()))
//             .mapToLong(Trade::getVolume)
//             .sum();

//     return new PortfolioSummaryResponse(totalInvestment, totalStocksPurchased);

public PortfolioSummaryResponse getPortfolioSummary() {
    List<Trade> trades = tradeRepository.findAll();

    // Total Investment
    BigDecimal totalInvestment = trades.stream()
            .filter(t -> "BUY".equalsIgnoreCase(t.getBuyOrSell()))
            .map(t -> t.getPrice().multiply(BigDecimal.valueOf(t.getVolume())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    // Total Stocks Purchased
    long totalStocksPurchased = trades.stream()
            .filter(t -> "BUY".equalsIgnoreCase(t.getBuyOrSell()))
            .mapToLong(Trade::getVolume)
            .sum();

    // Sector-wise investment
    Map<String, BigDecimal> sectorWiseInvestment = trades.stream()
            .filter(t -> "BUY".equalsIgnoreCase(t.getBuyOrSell()))
            .collect(Collectors.groupingBy(
                    Trade::getSector,
                    Collectors.reducing(
                            BigDecimal.ZERO,
                            t -> t.getPrice().multiply(BigDecimal.valueOf(t.getVolume())),
                            BigDecimal::add
                    )
            ));

    return new PortfolioSummaryResponse(totalInvestment, totalStocksPurchased, sectorWiseInvestment);
}

    // Inside TradeService
    @Value("${twelvedata.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public BigDecimal getCurrentPrice(String stockTicker) {
        String url = String.format(
                "https://api.twelvedata.com/price?symbol=%s&apikey=%s",
                stockTicker,
                apiKey
        );

        try {
            // Response is in form: {"price": "150.42"}
            var response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("price")) {
                return new BigDecimal(response.get("price").toString()).setScale(2, RoundingMode.HALF_UP);
            } else {
                throw new RuntimeException("Price not found for " + stockTicker);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error fetching price for " + stockTicker, e);
        }
    }


}


// package com.project.stock_trading.service;

// import com.project.stock_trading.dto.TradeRequest;
// import com.project.stock_trading.dto.TradeResponse;
// import com.project.stock_trading.entity.Trade;
// import com.project.stock_trading.repository.TradeRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// public class TradeService {

//     private final TradeRepository tradeRepository;

//     // public TradeService(TradeRepository tradeRepository) {
//     //     this.tradeRepository = tradeRepository;
//     // }

//     public TradeResponse createTrade(TradeRequest request) {
//         Trade trade = new Trade();
//         trade.setStockTicker(request.getStockTicker());
//         trade.setPrice(request.getPrice());
//         trade.setVolume(request.getVolume());
//         trade.setBuyOrSell(request.getBuyOrSell());
//         trade.setStatusCode(0); // Pending
//         trade.setTimestamp(LocalDateTime.now());

//         Trade saved = tradeRepository.save(trade);

//         return new TradeResponse(
//                 saved.getId(),
//                 saved.getStockTicker(),
//                 saved.getPrice(),
//                 saved.getVolume(),
//                 saved.getBuyOrSell(),
//                 saved.getStatusCode(),
//                 saved.getTimestamp()
//         );
//     }

//     public List<TradeResponse> getAllTrades() {
//         return tradeRepository.findAll().stream().map(trade ->
//                 new TradeResponse(
//                         trade.getId(),
//                         trade.getStockTicker(),
//                         trade.getPrice(),
//                         trade.getVolume(),
//                         trade.getBuyOrSell(),
//                         trade.getStatusCode(),
//                         trade.getTimestamp()
//                 )
//         ).collect(Collectors.toList());
//     }

//     public TradeResponse getTradeById(Long id) {
//         Trade trade = tradeRepository.findById(id).orElseThrow();
//         return new TradeResponse(
//                 trade.getId(),
//                 trade.getStockTicker(),
//                 trade.getPrice(),
//                 trade.getVolume(),
//                 trade.getBuyOrSell(),
//                 trade.getStatusCode(),
//                 trade.getTimestamp()
//         );
//     }

//     public List<TradeResponse> getTradesByStatusCode(int statusCode) {
//         return tradeRepository.findByStatusCode(statusCode).stream().map(trade ->
//                 new TradeResponse(
//                         trade.getId(),
//                         trade.getStockTicker(),
//                         trade.getPrice(),
//                         trade.getVolume(),
//                         trade.getBuyOrSell(),
//                         trade.getStatusCode(),
//                         trade.getTimestamp()
//                 )
//         ).collect(Collectors.toList());
//     }
// }
