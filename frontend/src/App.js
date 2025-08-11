import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import TradeHistoryPage from "./pages/TradeHistoryPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <Header />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/place-order" element={<PlaceOrderPage />} />
              <Route path="/trade-history" element={<TradeHistoryPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
