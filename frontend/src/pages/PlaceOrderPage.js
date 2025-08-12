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
      <h1>Available Stocks</h1>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by ticker or company name..."
          value={searchTicker}
          onChange={(e) => setSearchTicker(e.target.value)}
          className="search-bar"
        />
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

      <table className="stocks-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Company Name</th>
            <th>Available Volume</th>
            <th>Sector</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.ticker}</td>
              <td>{stock.companyName}</td>
              <td>{stock.availableVolume}</td>
              <td>{stock.sector}</td>
              <td>
                <button
                  className="buy-button"
                  onClick={() => handleBuyClick(stock)}
                >
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buy Modal */}
      {selectedStock && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "30px 40px",
              width: "350px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "15px", fontWeight: "700", fontSize: "22px" }}>
              Buy {selectedStock.companyName} ({selectedStock.ticker})
            </h2>

            {loadingPrice ? (
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>Loading live price...</p>
            ) : (
              <p style={{ fontSize: "18px", marginBottom: "25px", color: livePrice === "N/A" ? "#a00" : "#333" }}>
                Live Price: {livePrice === "N/A" ? "Unavailable" : `$${livePrice}`}
              </p>
            )}

            <label
              htmlFor="quantity-input"
              style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "16px", color: "#555" }}
            >
              Quantity:
            </label>
            <input
              id="quantity-input"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "16px",
                borderRadius: "6px",
                border: "1.5px solid #ccc",
                marginBottom: "30px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleConfirmBuy}
                disabled={loadingPrice}
                style={{
                  flex: "1",
                  padding: "12px 0",
                  marginRight: "10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: loadingPrice ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => !loadingPrice && (e.target.style.backgroundColor = "#0056b3")}
                onMouseLeave={(e) => !loadingPrice && (e.target.style.backgroundColor = "#007bff")}
              >
                Confirm Buy
              </button>

              <button
                onClick={() => setSelectedStock(null)}
                style={{
                  flex: "1",
                  padding: "12px 0",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a6268")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#6c757d")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {sellTrade && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "30px 40px",
              width: "350px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "15px", fontWeight: "700", fontSize: "22px" }}>
              Sell {sellTrade.companyName} ({sellTrade.stockTicker})
            </h2>

            {sellLoadingPrice ? (
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>Loading live price...</p>
            ) : (
              <p style={{ fontSize: "18px", marginBottom: "25px", color: sellLivePrice === "N/A" ? "#a00" : "#333" }}>
                Live Price: {sellLivePrice === "N/A" ? "Unavailable" : `$${sellLivePrice}`}
              </p>
            )}

            <label
              htmlFor="sell-quantity-input"
              style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "16px", color: "#555" }}
            >
              Quantity (max {sellTrade.volume}):
            </label>
            <input
              id="sell-quantity-input"
              type="number"
              min="1"
              max={sellTrade.volume}
              value={sellQuantity}
              onChange={(e) => setSellQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "16px",
                borderRadius: "6px",
                border: "1.5px solid #ccc",
                marginBottom: "30px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleConfirmSell}
                disabled={sellLoadingPrice}
                style={{
                  flex: "1",
                  padding: "12px 0",
                  marginRight: "10px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: sellLoadingPrice ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => !sellLoadingPrice && (e.target.style.backgroundColor = "#a71d2a")}
                onMouseLeave={(e) => !sellLoadingPrice && (e.target.style.backgroundColor = "#dc3545")}
              >
                Confirm Sell
              </button>

              <button
                onClick={() => setSellTrade(null)}
                style={{
                  flex: "1",
                  padding: "12px 0",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a6268")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#6c757d")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trade History */}
      <h1 className="trade-history-title">Trade History</h1>
      <table className="trade-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Price</th>
            <th>Volume</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {trades.map((trade) => (
    <tr key={trade.id}>
      <td>{trade.stockTicker}</td>
      <td>{trade.price}</td>
      <td>{trade.volume}</td>
      <td>
        {trade.buyOrSell === "BUY"
          ? "BOUGHT"
          : trade.buyOrSell === "SELL"
          ? "SOLD"
          : "Failed"}
      </td>
      <td>
        {trade.buyOrSell === "BUY" && (
          <>
            <button
              className="sell-button"
              onClick={() => openSellModal(trade)}
              style={{ marginRight: "8px" }}
            >
              Sell
            </button>
            <button
              className="buy-again-button"
              onClick={() => handleBuyAgainClick(trade)}
            >
              Buy Again
            </button>
          </>
        )}

        {trade.buyOrSell === "SELL" && (
          <button
            className="buy-again-button"
            onClick={() => handleBuyAgainClick(trade)}
          >
            Buy Again
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}

export default PlaceOrderPage;




//------------------------//
//ahana's code1
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import api from "../api";
// import "./PlaceOrder.css";

// function PlaceOrderPage() {
//   const [stocks, setStocks] = useState([]);
//   const [searchTicker, setSearchTicker] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [selectedSector, setSelectedSector] = useState("");

//   const tickersList = [
//     { ticker: "NVDA", companyName: "NVIDIA Corp", sector: "Technology", availableVolume: 100 },
//     { ticker: "AAPL", companyName: "Apple Inc.", sector: "Technology", availableVolume: 200 },
//     { ticker: "TSLA", companyName: "Tesla Inc.", sector: "Automobile", availableVolume: 150 },
//     { ticker: "AMZN", companyName: "Amazon.com Inc.", sector: "E-commerce", availableVolume: 180 },
//     { ticker: "GOOGL", companyName: "Alphabet Inc.", sector: "Technology", availableVolume: 120 },
//     { ticker: "NFLX", companyName: "Netflix Inc.", sector: "Entertainment", availableVolume: 90 },
//     { ticker: "META", companyName: "Meta Platforms Inc.", sector: "Technology", availableVolume: 110 },
//     { ticker: "MSFT", companyName: "Microsoft Corp", sector: "Technology", availableVolume: 140 },
//     { ticker: "SONY", companyName: "Sony Group Corp", sector: "Entertainment", availableVolume: 130 },
//     { ticker: "F", companyName: "Ford Motor Co.", sector: "Automobile", availableVolume: 170 }
//   ];

//   useEffect(() => {
//     fetchStockPrices();
//   }, []);

//   const fetchStockPrices = async () => {
//   try {
//     const promises = tickersList.map(async (stock) => {
//       try {
//         const res = await axios.get(`http://localhost:8080/api/trades/price/${stock.ticker}`);
//         return {
//           ...stock,
//           price: res.data.price
//         };
//       } catch (err) {
//         console.error(`Error fetching price for ${stock.ticker}:`, err.message);
//         return {
//           ...stock,
//           price: "N/A"
//         };
//       }
//     });

//     const results = await Promise.all(promises);
//     setStocks(results);
//   } catch (error) {
//     console.error("Unexpected error fetching stock prices:", error);
//   }
// };;

//   const handleBuy = async (stock) => {
//     const trade = {
//       stockTicker: stock.ticker,
//       price: stock.price,
//       volume: 1,
//       buyOrSell: "BUY",
//       statusCode: 1
//     };

//     try {
//       await api.post("/trades", trade);
//       alert(`Trade placed successfully for ${stock.ticker}`);
//     } catch (err) {
//       console.error(err);
//       alert("Error placing trade");
//     }
//   };

//   const filteredStocks = stocks.filter((stock) => {
//     const matchesTicker =
//       stock.ticker?.toLowerCase().includes(searchTicker.toLowerCase()) ||
//       stock.companyName?.toLowerCase().includes(searchTicker.toLowerCase());

//     const matchesPrice =
//       maxPrice === "" || parseFloat(stock.price) <= parseFloat(maxPrice);

//     const matchesSector =
//       selectedSector === "" || stock.sector === selectedSector;

//     return matchesTicker && matchesPrice && matchesSector;
//   });

//   return (
//     <div className="place-order-container">
//       <h1>Available Stocks</h1>

//       {/* Filters */}
//       <div className="filters-container">
//         <input
//           type="text"
//           placeholder="Search by ticker or company name..."
//           value={searchTicker}
//           onChange={(e) => setSearchTicker(e.target.value)}
//           className="search-bar"
//         />
//         <input
//           type="number"
//           placeholder="Max Price"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           className="price-bar"
//         />
//         <select
//           value={selectedSector}
//           onChange={(e) => setSelectedSector(e.target.value)}
//           className="sector-dropdown"
//         >
//           <option value="">All Sectors</option>
//           <option value="Technology">Technology</option>
//           <option value="Automobile">Automobile</option>
//           <option value="E-commerce">E-commerce</option>
//           <option value="Entertainment">Entertainment</option>
//         </select>
//       </div>

//       <table className="stocks-table">
//         <thead>
//           <tr>
//             <th>Ticker</th>
//             <th>Company Name</th>
//             <th>Price</th>
//             <th>Available Volume</th>
//             <th>Sector</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredStocks.map((stock, index) => (
//             <tr key={index}>
//               <td>{stock.ticker}</td>
//               <td>{stock.companyName}</td>
//               <td>{stock.price}</td>
//               <td>{stock.availableVolume}</td>
//               <td>{stock.sector}</td>
//               <td>
//                 <button
//                   className="buy-button"
//                   onClick={() => handleBuy(stock)}
//                 >
//                   Buy
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default PlaceOrderPage;

//---------------------//
//anushka's code
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import api from "../api";
// import "./PlaceOrder.css";

// function PlaceOrderPage() {
//   const [stocks, setStocks] = useState([]);
//   const [searchTicker, setSearchTicker] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [selectedSector, setSelectedSector] = useState(""); // ✅ new state

//   useEffect(() => {
//     fetchStocks();
//   }, []);

//   const fetchStocks = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/trades");
//       setStocks(response.data);
//     } catch (error) {
//       console.error("Error fetching stocks:", error);
//     }
//   };

//   const handleBuy = async (stock) => {
//     const trade = {
//       stockTicker: stock.ticker,
//       price: stock.price,
//       volume: 1,
//       buyOrSell: "BUY",
//       statusCode: 1
//     };

//     try {
//       await api.post("/trades", trade);
//       alert(`Trade placed successfully for ${stock.ticker}`);
//     } catch (err) {
//       console.error(err);
//       alert("Error placing trade");
//     }
//   };

//   const filteredStocks = stocks.filter((stock) => {
//     const matchesTicker =
//       stock.ticker?.toLowerCase().includes(searchTicker.toLowerCase()) ||
//       stock.companyName?.toLowerCase().includes(searchTicker.toLowerCase());

//     const matchesPrice =
//       maxPrice === "" || parseFloat(stock.price) <= parseFloat(maxPrice);

//     const matchesSector =
//       selectedSector === "" || stock.sector === selectedSector;

//     return matchesTicker && matchesPrice && matchesSector;
//   });

//   return (
//     <div className="place-order-container">
//       <h1>Available Stocks</h1>

//       {/* Filters */}
//       <div className="filters-container">
//         <input
//           type="text"
//           placeholder="Search by ticker or company name..."
//           value={searchTicker}
//           onChange={(e) => setSearchTicker(e.target.value)}
//           className="search-bar"
//         />
//         <input
//           type="number"
//           placeholder="Max Price"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           className="price-bar"
//         />
//         <select
//           value={selectedSector}
//           onChange={(e) => setSelectedSector(e.target.value)}
//           className="sector-dropdown"
//         >
//           <option value="">All Sectors</option>
//           <option value="Technology">Technology</option>
//           <option value="Automobile">Automobile</option>
//           <option value="E-commerce">E-commerce</option>
//           <option value="Entertainment">Entertainment</option>
//         </select>
//       </div>

//       <table className="stocks-table">
//         <thead>
//           <tr>
//             <th>Ticker</th>
//             <th>Company Name</th>
//             <th>Price</th>
//             <th>Available Volume</th>
//             <th>Sector</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredStocks.map((stock, index) => (
//             <tr key={index}>
//               <td>{stock.ticker}</td>
//               <td>{stock.companyName}</td>
//               <td>{stock.price}</td>
//               <td>{stock.availableVolume}</td>
//               <td>{stock.sector}</td>
//               <td>
//                 <button
//                   className="buy-button"
//                   onClick={() => handleBuy(stock)}
//                 >
//                   Buy
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default PlaceOrderPage;
