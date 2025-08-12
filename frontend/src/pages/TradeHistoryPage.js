import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TradeHistory.css";

function TradeHistoryPage() {
//   const [trades, setTrades] = useState([]);

//   useEffect(() => {
//     fetchTrades();
//   }, []);

//   const fetchTrades = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/trades");
//       setTrades(response.data);
//     } catch (error) {
//       console.error("Error fetching trades:", error);
//     }
//   };

//   const handleSell = async (tradeId) => {
//     if (!window.confirm("Are you sure you want to sell this stock?")) return;

//     try {
//       await axios.delete(`http://localhost:8080/api/trades/${tradeId}`);
//       setTrades(trades.filter((trade) => trade.id !== tradeId)); // Remove from UI
//       alert("Stock sold successfully!");
//     } catch (error) {
//       console.error("Error selling stock:", error);
//       alert("Error selling stock");
//     }
//   };

//   return (
//     <div className="trade-history-container">
//       <h1 className="trade-history-title">Trade History</h1>
//       <table className="trade-table">
//         <thead>
//           <tr>
//             <th>Ticker</th>
//             <th>Price</th>
//             <th>Volume</th>
//             <th>Status</th>
//             <th>Action</th> {/* New column */}
//           </tr>
//         </thead>
//         <tbody>
//           {trades.map((trade) => (
//             <tr key={trade.id}>
//               <td>{trade.stockTicker}</td>
//               <td>{trade.price}</td>
//               <td>{trade.volume}</td>
              
//               <td>
//                 {trade.statusCode === 1
//                   ? "Completed"
//                   : trade.statusCode === 0
//                   ? "Pending"
//                   : "Failed"}
//               </td>
//               <td>
//                 <button
//                   className="sell-button"
//                   onClick={() => handleSell(trade.id)}
//                 >
//                   Sell
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
}

export default TradeHistoryPage;