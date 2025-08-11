import React from "react";
import PortfolioSummary from "../components/PortfolioSummary";
import TradeForm from "../components/TradeForm";
import TradeHistory from "../components/TradeHistory";

function HomePage() {
  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#F8FAFC", // light background
        minHeight: "100vh"
      }}
    >
      {/* First Row: Portfolio & Quick Order */}
      <div className="row g-4 justify-content-center">
        {/* Portfolio Summary */}
        <div className="col-lg-4 col-md-6">
          <div
            className="p-3 shadow-sm"
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              height: "100%"
            }}
          >
            <PortfolioSummary />
          </div>
        </div>

        {/* Quick Order Form */}
        <div className="col-lg-6 col-md-8">
          <div
            className="p-3 shadow-sm"
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              height: "100%"
            }}
          >
            <TradeForm />
          </div>
        </div>
      </div>

      {/* Second Row: Recent Trades */}
      <div className="row mt-4 justify-content-center">
        <div className="col-lg-10 col-md-12">
          <div
            className="p-3 shadow-sm"
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E2E8F0"
            }}
          >
            <TradeHistory limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
