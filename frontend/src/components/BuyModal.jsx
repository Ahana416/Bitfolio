// src/components/BuyModal.jsx
import React, { useState, useEffect } from 'react';

export default function BuyModal({ show, onClose, ticker, companyName, sector, availableVolume }) {
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (show && ticker) {
      console.log(`[BuyModal] Fetching price for ${ticker}...`);
      fetch(`http://localhost:8080/api/stocks/${ticker}/price`)
        .then(res => {
          console.log(`[BuyModal] API response status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log(`[BuyModal] Price data received:`, data);
          setPrice(data.price);
        })
        .catch(err => {
          console.error(`[BuyModal] Error fetching price:`, err);
        });
    }
  }, [show, ticker]);

  const handleBuy = () => {
    console.log(`[BuyModal] Buying ${quantity} of ${ticker} at price ${price}`);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Buy Stock</h2>
        <p><strong>Ticker:</strong> {ticker}</p>
        <p><strong>Company:</strong> {companyName}</p>
        <p><strong>Sector:</strong> {sector}</p>
        <p><strong>Available Volume:</strong> {availableVolume}</p>
        <p><strong>Price:</strong> {price !== null ? `$${price}` : 'Loading...'}</p>

        <label>
          Quantity:
          <input
            type="number"
            min="1"
            max={availableVolume}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>

        <div className="modal-actions">
          <button onClick={handleBuy} disabled={price === null}>Confirm Buy</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 350px;
          max-width: 90%;
        }
        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        .modal-actions button {
          flex: 1;
          padding: 8px;
          cursor: pointer;
        }
        input[type="number"] {
          width: 100%;
          margin-top: 5px;
          padding: 5px;
        }
      `}</style>
    </div>
  );
}



// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function BuyModal({ stock, onClose }) {
//   const [price, setPrice] = useState(null);
//   const [volume, setVolume] = useState(1);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (stock?.ticker) {
//       // Example API call to fetch price
//       axios
//         .get(`http://localhost:8080/api/price/${stock.ticker}`)
//         .then((res) => setPrice(res.data.price))
//         .catch(() => setPrice("Error"));
//     }
//   }, [stock]);

//   const handleBuy = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         stockTicker: stock.ticker,
//         price,
//         volume,
//         buyOrSell: "BUY",
//         statusCode: 0,
//         sector: stock.sector
//       };

//       await axios.post("http://localhost:8080/api/trades", payload);
//       alert("Stock bought successfully!");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Error buying stock.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       position: "fixed", top: "50%", left: "50%",
//       transform: "translate(-50%, -50%)",
//       background: "#fff", padding: "20px", border: "1px solid #ccc", zIndex: 1000
//     }}>
//       <h3>Buy {stock.companyName}</h3>
//       <p><strong>Ticker:</strong> {stock.ticker}</p>
//       <p><strong>Sector:</strong> {stock.sector}</p>
//       <p><strong>Available Volume:</strong> {stock.availableVolume}</p>
//       <p><strong>Price:</strong> {price !== null ? `$${price}` : "Loading..."}</p>

//       <label>
//         Quantity:
//         <input
//           type="number"
//           min="1"
//           value={volume}
//           onChange={(e) => setVolume(Number(e.target.value))}
//         />
//       </label>
//       <br /><br />

//       <button onClick={handleBuy} disabled={loading || !price}>
//         {loading ? "Processing..." : "Confirm Buy"}
//       </button>
//       <button onClick={onClose} style={{ marginLeft: "10px" }}>
//         Cancel
//       </button>
//     </div>
//   );
// }
