import React, { useEffect, useState } from "react";

function PortfolioSummary() {
  const [summary, setSummary] = useState({
    totalInvestment: 0,
    totalStocksPurchased: 0,
    totalGain: 0
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/trades/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error("Error fetching portfolio summary:", err));
  }, []);

  return (
    <div className="card shadow-sm border-0 p-3">
      <h5 className="mb-3">📊 Portfolio Summary</h5>
      <div className="d-flex justify-content-between">
        <div>
          <small className="text-muted">Holdings</small>
          <h6 className="mb-0">{summary.totalStocksPurchased} Stocks</h6>
        </div>
        <div>
          <small className="text-muted">Investment</small>
          <h6 className="mb-0">${Number(summary.totalInvestment).toLocaleString()}</h6>
        </div>
        <div>
          <small className="text-muted">Total Gain</small>
          <h6
            className={`mb-0 ${
              summary.totalGain >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {summary.totalGain >= 0 ? "+" : "-"}$
            {Math.abs(summary.totalGain).toLocaleString()}
          </h6>
        </div>
      </div>
    </div>
  );
}

export default PortfolioSummary;

// function PortfolioSummary() {
//   const [summary, setSummary] = useState({ totalInvestment: 0, totalStocksPurchased: 0 });

//   useEffect(() => {
//     fetch("http://localhost:8080/api/trades/summary")
//       .then((res) => res.json())
//       .then((data) => setSummary(data))
//       .catch((err) => console.error("Error fetching portfolio summary:", err));
//   }, []);

//   return (
//     <div className="card shadow-sm border-0 h-100">
//       <div className="card-body">
//         <h5 className="card-title mb-4">📊 Portfolio Summary</h5>
//         <p className="mb-2"><strong>Total Value:</strong> ${Number(summary.totalInvestment).toLocaleString()}</p>
//         <p className="mb-0"><strong>Holdings:</strong> {summary.totalStocksPurchased} Stocks</p>
//       </div>
//     </div>
//   );
// }

// export default PortfolioSummary;

// // import React, { useEffect, useState } from "react";

// // function PortfolioSummary() {
// //   const [summary, setSummary] = useState({ totalInvestment: 0, totalStocksPurchased: 0 });

// //   useEffect(() => {
// //     fetch("http://localhost:8080/api/trades/summary")
// //       .then((res) => res.json())
// //       .then((data) => setSummary(data))
// //       .catch((err) => console.error("Error fetching portfolio summary:", err));
// //   }, []);

// //   return (
// //     <div className="card p-3 shadow-sm">
// //       <h5>Dashboard Summary</h5>
// //       <p>
// //         <strong>Portfolio Value:</strong>{" "}
// //         ${Number(summary.totalInvestment).toLocaleString()}
// //       </p>
// //       <p>
// //         <strong>Holdings:</strong> {summary.totalStocksPurchased} Stocks
// //       </p>
// //     </div>
// //   );
// // }

// // export default PortfolioSummary;
