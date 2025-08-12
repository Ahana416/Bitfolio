import static java.lang.Math.log;

import com.project.stock_trading.entity.Trade;
import com.project.stock_trading.entity.ExecutedTrade;
import com.project.stock_trading.repository.TradeRepository;
import com.project.stock_trading.repository.ExecutedTradeRepository;
import com.project.stock_trading.service.TradeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
// @Slf4j
public class TradeExecutionScheduler {

    // If Lombok @Slf4j is not working, uncomment the following line and remove
    // @Slf4j annotation above
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(TradeExecutionScheduler.class);

    private TradeRepository tradeRepository;
    private ExecutedTradeRepository executedTradeRepository;
    private TradeService tradeService;

    // public TradeExecutionScheduler(TradeRepository tradeRepository,
    // ExecutedTradeRepository executedTradeRepository, TradeService tradeService) {
    // this.tradeRepository = tradeRepository;
    // this.executedTradeRepository = executedTradeRepository;
    // this.tradeService = tradeService;
    // }

    @Scheduled(fixedRate = 3000000) // every 60 seconds
    public void checkTrades() {
        List<Trade> pendingTrades = tradeRepository.findByStatusCode(1);

        for (Trade trade : pendingTrades) {
            try {
                BigDecimal currentPrice = tradeService.getCurrentPrice(trade.getStockTicker());

                boolean shouldExecute = (trade.getBuyOrSell().equalsIgnoreCase("BUY")
                        && currentPrice.compareTo(trade.getPrice()) <= 0)
                        || (trade.getBuyOrSell().equalsIgnoreCase("SELL")
                                && currentPrice.compareTo(trade.getPrice()) >= 0);

                if (shouldExecute) {
                    trade.setStatusCode(0);
                    tradeRepository.save(trade);

                    ExecutedTrade executed = new ExecutedTrade(trade);
                    executedTradeRepository.save(executed);

                    tradeRepository.delete(trade);

                    log.info("Executed trade for stock: {} at price {}", trade.getStockTicker(), currentPrice);
                }

            } catch (Exception e) {
                log.error("Failed to execute trade for stock: {}", trade.getStockTicker(), e);
            }
        }
    }
}