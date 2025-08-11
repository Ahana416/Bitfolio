import React from "react";
import ProfileMenu from "./ProfileMenu";

function Header() {
  return (
    <header
      style={{
        background: "#F8FAFC",
        padding: "12px 24px",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Side */}
        <div>
          <h4 style={{ margin: 0, fontWeight: "600", color: "#334155" }}>
            Welcome back, John Doe
          </h4>
          <small style={{ color: "#666" }}>Here’s your portfolio summary</small>
        </div>

        {/* Right Side - Interactive Profile Menu */}
        <ProfileMenu />
      </div>
    </header>
  );
}

export default Header;


// import React from "react";

// function Header() {
//   return (
//     <div style={{ background: "#f8f9fa", padding: "10px 20px", borderBottom: "1px solid #ddd" }}>
//       <div className="d-flex justify-content-between align-items-center">
//         <h5>Welcome, John Doe</h5>
//         <img
//           src="https://via.placeholder.com/40"
//           alt="profile"
//           style={{ borderRadius: "50%" }}
//         />
//       </div>
//     </div>
//   );
// }

// export default Header;
