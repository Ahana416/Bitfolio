import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import "./PlaceOrder.css";

function PlaceOrderPage() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [trades, setTrades] = useState([]);

  // For Sell Modal
  const [sellTrade, setSellTrade] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellLivePrice, setSellLivePrice] = useState(null);
  const [sellLoadingPrice, setSellLoadingPrice] = useState(false);

  const tickersList = [
    { ticker: "NVDA", companyName: "NVIDIA Corp", sector: "Technology", availableVolume: 100 },
    { ticker: "AAPL", companyName: "Apple Inc.", sector: "Technology", availableVolume: 200 },
    { ticker: "TSLA", companyName: "Tesla Inc.", sector: "Automobile", availableVolume: 150 },
    { ticker: "AMZN", companyName: "Amazon.com Inc.", sector: "E-commerce", availableVolume: 180 },
    { ticker: "GOOGL", companyName: "Alphabet Inc.", sector: "Technology", availableVolume: 120 },
    { ticker: "NFLX", companyName: "Netflix Inc.", sector: "Entertainment", availableVolume: 90 },
    { ticker: "META", companyName: "Meta Platforms Inc.", sector: "Technology", availableVolume: 110 },
    { ticker: "MSFT", companyName: "Microsoft Corp", sector: "Technology", availableVolume: 140 },
    { ticker: "SONY", companyName: "Sony Group Corp", sector: "Entertainment", availableVolume: 130 },
    { ticker: "F", companyName: "Ford Motor Co.", sector: "Automobile", availableVolume: 170 }
  ];

  const [searchTicker, setSearchTicker] = useState("");
  const [selectedSector, setSelectedSector] = useState("");

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/trades");
      setTrades(response.data);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  // BUY modal handlers
  const handleBuyClick = async (stock) => {
    setSelectedStock(stock);
    setQuantity(1);
    setLivePrice(null);
    setLoadingPrice(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/trades/price/${stock.ticker}`);
      setLivePrice(res.data.price);
    } catch (err) {
      console.error(`Error fetching price for ${stock.ticker}:`, err.message);
      setLivePrice("N/A");
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleBuyAgainClick = async (trade) => {
    const stock = tickersList.find(s => s.ticker === trade.stockTicker);
    if (!stock) {
      alert("Stock information not found for buying again.");
      return;
    }
    setSelectedStock(stock);
    setQuantity(1);
    setLivePrice(null);
    setLoadingPrice(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/trades/price/${stock.ticker}`);
      setLivePrice(res.data.price);
    } catch (err) {
      console.error(`Error fetching price for ${stock.ticker}:`, err.message);
      setLivePrice("N/A");
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleConfirmBuy = async () => {
    if (!selectedStock || livePrice === null || livePrice === "N/A") {
      alert("Cannot place order. Price unavailable.");
      return;
    }
    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    const trade = {
      stockTicker: selectedStock.ticker,
      companyName: selectedStock.companyName,
      sector: selectedStock.sector,
      price: livePrice,
      volume: quantity,
      buyOrSell: "BUY",
      statusCode: 0
    };

    try {
      const response = await api.post("/trades", trade);
      alert(`Trade placed successfully for ${selectedStock.ticker}`);
      setSelectedStock(null);
      fetchTrades();
    } catch (err) {
      console.error("Error placing trade:", err.response?.data || err.message);
      alert("Error placing trade. Check console for details.");
    }
  };

  // SELL modal open
  const openSellModal = async (trade) => {
    setSellTrade(trade);
    setSellQuantity(trade.volume);
    setSellLivePrice(null);
    setSellLoadingPrice(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/trades/price/${trade.stockTicker}`);
      setSellLivePrice(res.data.price);
    } catch (err) {
      console.error(`Error fetching price for ${trade.stockTicker}:`, err.message);
      setSellLivePrice("N/A");
    } finally {
      setSellLoadingPrice(false);
    }
  };

  // SELL confirm
  const handleConfirmSell = async () => {
    if (!sellTrade || sellLivePrice === null || sellLivePrice === "N/A") {
      alert("Cannot sell. Price unavailable.");
      return;
    }
    if (sellQuantity < 1 || sellQuantity > sellTrade.volume) {
      alert(`Quantity must be between 1 and ${sellTrade.volume}`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/trades/${sellTrade.id}/sell`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: sellQuantity, price: sellLivePrice }),
      });

      if (!res.ok) throw new Error("Sell failed");

      const updatedTrade = await res.json();

      alert(`Sold ${sellQuantity} shares at $${sellLivePrice} each.`);

      fetchTrades();
      setSellTrade(null);
    } catch (error) {
      console.error("Error selling stock:", error);
      alert("Error selling stock");
    }
  };

  const filteredStocks = tickersList.filter((stock) => {
    const matchesTicker =
      stock.ticker?.toLowerCase().includes(searchTicker.toLowerCase()) ||
      stock.companyName?.toLowerCase().includes(searchTicker.toLowerCase());
    const matchesSector = selectedSector === "" || stock.sector === selectedSector;
    return matchesTicker && matchesSector;
  });

  return (
    <div className="place-order-container">
      {/* Header Section */}
      <div className="trading-header">
        
        <div className="market-status">
          <span className="status-indicator"></span>
          Market Open
        </div>
      </div>

      {/* Available Stocks Section */}
      <div className="stocks-section">
        <div className="section-header">
          <h2 className="section-title">Available Stocks</h2>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-label">Total Stocks</span>
              <span className="stat-value">{filteredStocks.length}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="filters-container">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by ticker or company name..."
                value={searchTicker}
                onChange={(e) => setSearchTicker(e.target.value)}
                className="search-bar"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="sector-dropdown"
            >
              <option value="">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Automobile">Automobile</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
        </div>

        {/* Stocks Table */}
        <div className="table-container">
          <table className="stocks-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Available Volume</th>
                <th>Sector</th>
                <th className="action-column">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock, index) => (
                <tr key={index} className="stock-row">
                  <td className="ticker-cell">
                    <span className="ticker-symbol">{stock.ticker}</span>
                  </td>
                  <td className="company-cell">
                    <span className="company-name">{stock.companyName}</span>
                  </td>
                  <td className="volume-cell">
                    <span className="volume-badge">{stock.availableVolume.toLocaleString()}</span>
                  </td>
                  <td className="sector-cell">
                    <span className={`sector-badge sector-${stock.sector.toLowerCase().replace(/[^a-z]/g, '')}`}>
                      {stock.sector}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="buy-button primary-action"
                      onClick={() => handleBuyClick(stock)}
                    >
                      <span className="button-icon">📈</span>
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buy Modal */}
      {selectedStock && (
        <div className="modal-overlay">
          <div className="modal-content buy-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                Buy Order - {selectedStock.ticker}
              </h3>
              <button 
                className="close-button"
                onClick={() => setSelectedStock(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="stock-info">
                <div className="stock-detail">
                  <span className="detail-label">Company:</span>
                  <span className="detail-value">{selectedStock.companyName}</span>
                </div>
                <div className="stock-detail">
                  <span className="detail-label">Sector:</span>
                  <span className={`sector-badge sector-${selectedStock.sector.toLowerCase().replace(/[^a-z]/g, '')}`}>
                    {selectedStock.sector}
                  </span>
                </div>
              </div>

              <div className="price-display">
                {loadingPrice ? (
                  <div className="price-loading">
                    <span className="loading-spinner"></span>
                    Loading live price...
                  </div>
                ) : (
                  <div className="price-info">
                    <span className="price-label">Live Price:</span>
                    <span className={`price-value ${livePrice === "N/A" ? "price-unavailable" : ""}`}>
                      {livePrice === "N/A" ? "Unavailable" : `$${livePrice}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="quantity-input-group">
                <label className="quantity-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="quantity-input"
                />
              </div>

              {livePrice && livePrice !== "N/A" && (
                <div className="order-summary">
                  <div className="summary-item">
                    <span>Estimated Total:</span>
                    <span className="total-amount">${(livePrice * quantity).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                onClick={handleConfirmBuy}
                disabled={loadingPrice}
                className="confirm-buy-button"
              >
                Confirm Buy Order
              </button>
              <button
                onClick={() => setSelectedStock(null)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {sellTrade && (
        <div className="modal-overlay">
          <div className="modal-content sell-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                Sell Order - {sellTrade.stockTicker}
              </h3>
              <button 
                className="close-button"
                onClick={() => setSellTrade(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="stock-info">
                <div className="stock-detail">
                  <span className="detail-label">Company:</span>
                  <span className="detail-value">{sellTrade.companyName}</span>
                </div>
                <div className="stock-detail">
                  <span className="detail-label">Holdings:</span>
                  <span className="detail-value">{sellTrade.volume} shares</span>
                </div>
              </div>

              <div className="price-display">
                {sellLoadingPrice ? (
                  <div className="price-loading">
                    <span className="loading-spinner"></span>
                    Loading live price...
                  </div>
                ) : (
                  <div className="price-info">
                    <span className="price-label">Live Price:</span>
                    <span className={`price-value ${sellLivePrice === "N/A" ? "price-unavailable" : ""}`}>
                      {sellLivePrice === "N/A" ? "Unavailable" : `$${sellLivePrice}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="quantity-input-group">
                <label className="quantity-label">Quantity (max {sellTrade.volume})</label>
                <input
                  type="number"
                  min="1"
                  max={sellTrade.volume}
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(Number(e.target.value))}
                  className="quantity-input"
                />
              </div>

              {sellLivePrice && sellLivePrice !== "N/A" && (
                <div className="order-summary">
                  <div className="summary-item">
                    <span>Estimated Total:</span>
                    <span className="total-amount">${(sellLivePrice * sellQuantity).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                onClick={handleConfirmSell}
                disabled={sellLoadingPrice}
                className="confirm-sell-button"
              >
                Confirm Sell Order
              </button>
              <button
                onClick={() => setSellTrade(null)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trade History Section */}
      <div className="trade-history-section">
        <div className="section-header">
          <h2 className="section-title">Trade History</h2>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-label">Total Trades</span>
              <span className="stat-value">{trades.length}</span>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="trade-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>Volume</th>
                <th>Status</th>
                <th className="action-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="trade-row">
                  <td className="ticker-cell">
                    <span className="ticker-symbol">{trade.stockTicker}</span>
                  </td>
                  <td className="price-cell">
                    <span className="price-value">${trade.price}</span>
                  </td>
                  <td className="volume-cell">
                    <span className="volume-badge">{trade.volume.toLocaleString()}</span>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge status-${trade.buyOrSell.toLowerCase()}`}>
                      {trade.buyOrSell === "BUY" ? "BOUGHT" : trade.buyOrSell === "SELL" ? "SOLD" : "FAILED"}
                    </span>
                  </td>
                  <td className="action-cell">
                    <div className="action-buttons">
                      {trade.buyOrSell === "BUY" && (
                        <button
                          className="sell-button secondary-action"
                          onClick={() => openSellModal(trade)}
                        >
                          <span className="button-icon">📉</span>
                          Sell
                        </button>
                      )}
                      <button
                        className="buy-again-button tertiary-action"
                        onClick={() => handleBuyAgainClick(trade)}
                      >
                        <span className="button-icon">🔄</span>
                        Buy Again
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderPage;