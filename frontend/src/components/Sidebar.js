import React from "react";
import { FaHome, FaChartPie, FaExchangeAlt, FaHistory } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Portfolio", icon: <FaChartPie />, path: "/portfolio" },
    { name: "Place Order", icon: <FaExchangeAlt />, path: "/place-order" },
    { name: "Trade History", icon: <FaHistory />, path: "/trade-history" }
  ];

  return (
    <div
      style={{
        width: "220px",
        background: "#1E293B", // Sidebar background
        color: "#E2E8F0", // Inactive link text
        height: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h4 className="mb-4" style={{ color: "#38BDF8" }}>📈 MyTrading</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li
              key={item.path}
              style={{
                cursor: "pointer",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "6px",
                background: isActive ? "#334155" : "transparent",
                color: isActive ? "#38BDF8" : "#E2E8F0",
                fontWeight: isActive ? "600" : "400",
                transition: "background 0.2s ease, color 0.2s ease"
              }}
            >
              <Link
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#38BDF8";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = isActive ? "#38BDF8" : "#E2E8F0";
                }}
              >
                {item.icon} {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
