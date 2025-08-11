import React, { useEffect, useState } from "react";
import api from "../api";

function TradeHistory({ limit }) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    api.get("/trades")
      .then(res => {
        if (limit) {
          setTrades(res.data.slice(0, limit));
        } else {
          setTrades(res.data);
        }
      })
      .catch(err => console.error(err));
  }, [limit]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title mb-4">📜 Recent Trades</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Ticker</th>
                <th>Price</th>
                <th>Volume</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(t => (
                <tr key={t.id}>
                  <td>{t.stockTicker}</td>
                  <td>${t.price.toFixed(2)}</td>
                  <td>{t.volume}</td>
                  <td className={t.buyOrSell === "BUY" ? "text-success" : "text-danger"}>
                    {t.buyOrSell}
                  </td>
                  <td>{t.status || "Completed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TradeHistory;

// import React, { useEffect, useState } from "react";
// import api from "../api";

// function TradeHistory() {
//   const [trades, setTrades] = useState([]);

//   useEffect(() => {
//     api.get("/trades")
//       .then(res => setTrades(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Ticker</th>
//           <th>Price</th>
//           <th>Volume</th>
//           <th>Type</th>
//           <th>Status</th>
//         </tr>
//       </thead>
//       <tbody>
//         {trades.map(t => (
//           <tr key={t.id}>
//             <td>{t.stockTicker}</td>
//             <td>{t.price}</td>
//             <td>{t.volume}</td>
//             <td>{t.buyOrSell}</td>
//             <td>{t.status}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// export default TradeHistory;
