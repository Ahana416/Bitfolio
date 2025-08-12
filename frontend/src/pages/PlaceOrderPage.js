//------------------ahana's code2-----------------------//
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

  // Fetch trades on mount
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

  const handleSell = async (tradeId) => {
    if (!window.confirm("Are you sure you want to sell this stock?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/trades/${tradeId}`);
      setTrades(trades.filter((trade) => trade.id !== tradeId));
      alert("Stock sold successfully!");
    } catch (error) {
      console.error("Error selling stock:", error);
      alert("Error selling stock");
    }
  };

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
      console.log("Sending trade to backend:", trade);
      const response = await api.post("/trades", trade);
      console.log("Backend response:", response.data);

      alert(`Trade placed successfully for ${selectedStock.ticker}`);
      setSelectedStock(null);
      fetchTrades(); // Refresh after buying
    } catch (err) {
      console.error("Error placing trade:", err.response?.data || err.message);
      alert("Error placing trade. Check console for details.");
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

      {/* Filters */}
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

      {/* Stock Table */}
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {selectedStock.companyName} ({selectedStock.ticker})
            </h3>
            {loadingPrice ? (
              <p>Loading live price...</p>
            ) : (
              <p>
                Live Price: {livePrice === "N/A" ? "Unavailable" : `$${livePrice}`}
              </p>
            )}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
            />
            <div className="modal-buttons">
              <button onClick={handleConfirmBuy} disabled={loadingPrice}>
                Confirm Buy
              </button>
              <button onClick={() => setSelectedStock(null)}>Cancel</button>
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
                {trade.statusCode === 0
                  ? "Completed"
                  : trade.statusCode === 1
                  ? "Pending"
                  : "Failed"}
              </td>
              <td>
                <button
                  className="sell-button"
                  onClick={() => handleSell(trade.id)}
                >
                  Sell
                </button>
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
