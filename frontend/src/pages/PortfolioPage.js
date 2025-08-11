import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import PortfolioSummary from "../components/PortfolioSummary"; // ✅ import your summary box

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

function PortfolioPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/trades")
      .then((res) => res.json())
      .then((data) => {
        setTrades(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trades:", err);
        setLoading(false);
      });
  }, []);

  // Compute holdings
  const holdings = trades.reduce((acc, trade) => {
    const ticker = trade.stockTicker;
    if (!acc[ticker]) {
      acc[ticker] = {
        ticker,
        quantity: 0,
        avgPrice: 0,
        totalCost: 0,
        sector: trade.sector || "Unknown"
      };
    }
    if (trade.buyOrSell === "BUY") {
      acc[ticker].quantity += trade.volume;
      acc[ticker].totalCost += trade.price * trade.volume;
    } else {
      acc[ticker].quantity -= trade.volume;
      acc[ticker].totalCost -= trade.price * trade.volume;
    }
    acc[ticker].avgPrice =
      acc[ticker].quantity > 0
        ? acc[ticker].totalCost / acc[ticker].quantity
        : 0;
    return acc;
  }, {});

  const holdingsArray = Object.values(holdings).filter((h) => h.quantity > 0);
  const totalValue = holdingsArray.reduce(
    (sum, h) => sum + h.avgPrice * h.quantity,
    0
  );
  const totalHoldings = holdingsArray.length;
  const overallPL = 0; // Placeholder

  // Chart Data
  const pieData = holdingsArray.map((h) => ({
    name: h.ticker,
    value: h.avgPrice * h.quantity
  }));

  const barData = holdingsArray.map((h) => ({
    name: h.ticker,
    quantity: h.quantity,
    value: h.avgPrice * h.quantity
  }));

  const sectorMap = holdingsArray.reduce((acc, h) => {
    if (!acc[h.sector]) acc[h.sector] = 0;
    acc[h.sector] += h.avgPrice * h.quantity;
    return acc;
  }, {});
  const sectorData = Object.entries(sectorMap).map(([sector, value]) => ({
    name: sector,
    value
  }));

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">Loading portfolio...</div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">📊 My Portfolio</h2>

      {/* ✅ Use your PortfolioSummary component */}
      <PortfolioSummary
        totalHoldings={totalHoldings}
        totalInvestment={totalValue}
        totalGain={overallPL}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Portfolio Allocation */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings Value */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Holdings Value</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector-wise Distribution */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Sector-wise Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={sectorData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {sectorData.map((entry, index) => (
                <Cell
                  key={`cell-sector-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PortfolioPage;
