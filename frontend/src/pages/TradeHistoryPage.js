import React, { useEffect, useState } from "react";
import axios from "axios";

function TradeHistoryPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/trades");
      setTrades(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load trades.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>Trade History</h1>

      {loading && <p style={{ textAlign: "center" }}>Loading trades...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {!loading && !error && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#1E293B",
                color: "#fff",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Ticker</th>
              <th style={thStyle}>Price ($)</th>
              <th style={thStyle}>Volume</th>
              <th style={thStyle}>Buy/Sell</th>
              <th style={thStyle}>Sector</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  backgroundColor:
                    trade.buyOrSell === "BUY" ? "#e6f0ff" : "#ffe6e6",
                }}
              >
                <td style={tdStyle}>{trade.id}</td>
                <td style={tdStyle}>{trade.stockTicker}</td>
                <td style={tdStyle}>{trade.price.toFixed(2)}</td>
                <td style={tdStyle}>{trade.volume}</td>
                <td style={tdStyle}>{trade.buyOrSell}</td>
                <td style={tdStyle}>{trade.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "12px 15px",
  borderBottom: "2px solid #0056b3",
};

const tdStyle = {
  padding: "10px 15px",
};

export default TradeHistoryPage;
