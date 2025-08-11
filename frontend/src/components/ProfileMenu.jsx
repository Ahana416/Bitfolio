import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import api from "../api"; // make sure this exists and works

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [riskAppetite, setRiskAppetite] = useState("Moderate");
  const [saving, setSaving] = useState(false);
  const menuRef = useRef(null);

  const user = {
    username: "John Doe",
    gender: "Male",
    userSince: "Jan 2023",
    email: "john.doe@example.com",
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const riskOptions = [
    { label: "Low", emoji: "🛡️" },
    { label: "Moderate", emoji: "⚖️" },
    { label: "High", emoji: "🚀" },
  ];

  // Optimistic save & close (no popup). If save fails we log the error.
  const handleSave = async (e) => {
    e.stopPropagation();           // important: prevent bubbling to document listener
    setSaving(true);
    setOpen(false);                // close immediately (optimistic)
    try {
      await api.post("/user/risk-appetite", { riskAppetite });
      // saved silently
    } catch (err) {
      console.error("Failed to update risk appetite:", err);
      // Optionally you could reopen the menu or surface a toast here.
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="position-relative" ref={menuRef}>
      <FaUserCircle
        size={40}
        style={{ cursor: "pointer", color: "#555", transition: "transform 0.15s ease" }}
        onClick={(e) => {
          e.stopPropagation();        // so the click that opens the menu doesn't bubble
          setOpen((o) => !o);
        }}
      />

      {open && (
        <div
          className="card shadow border-0 position-absolute end-0 mt-2"
          style={{ width: 260, zIndex: 1000, borderRadius: 10 }}
          onClick={(e) => e.stopPropagation()} // keep clicks inside from bubbling out
        >
          <div className="card-body p-3">
            <div className="d-flex align-items-center mb-3">
              <FaUserCircle size={50} style={{ color: "#777" }} className="me-3" />
              <div>
                <h6 className="mb-0">{user.username}</h6>
                <small className="text-muted">{user.email}</small>
              </div>
            </div>
            <hr />
            <div className="mb-2">
              <strong>Gender:</strong> <span className="text-muted">{user.gender}</span>
            </div>
            <div className="mb-2">
              <strong>User Since:</strong> <span className="text-muted">{user.userSince}</span>
            </div>

            <div className="mb-3">
              <strong>Risk Appetite:</strong>
              <select
                className="form-select form-select-sm mt-1"
                value={riskAppetite}
                onChange={(e) => setRiskAppetite(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                {riskOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.emoji} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-sm btn-primary w-100"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useState, useRef, useEffect } from "react";
// import { FaUserCircle } from "react-icons/fa"; // Profile icon

// function ProfileMenu() {
//   const [open, setOpen] = useState(false);
//   const [riskAppetite, setRiskAppetite] = useState("Moderate");
//   const menuRef = useRef();

//   const user = {
//     username: "John Doe",
//     gender: "Male",
//     userSince: "Jan 2023",
//     email: "john.doe@example.com",
//   };

//   useEffect(() => {
//     const handler = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, []);

//   const riskOptions = [
//     { label: "Low", emoji: "🛡️" },
//     { label: "Moderate", emoji: "⚖️" },
//     { label: "High", emoji: "🚀" },
//   ];

//   return (
//     <div className="position-relative" ref={menuRef}>
//       {/* Profile Icon */}
//       <FaUserCircle
//         size={40}
//         style={{
//           cursor: "pointer",
//           color: "#555",
//           transition: "transform 0.2s ease",
//         }}
//         onClick={() => setOpen(!open)}
//         onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//         onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
//       />

//       {/* Dropdown */}
//       {open && (
//         <div
//           className="card shadow border-0 position-absolute end-0 mt-2"
//           style={{
//             width: "260px",
//             zIndex: 1000,
//             borderRadius: "10px",
//           }}
//         >
//           <div className="card-body p-3">
//             {/* Header */}
//             <div className="d-flex align-items-center mb-3">
//               <FaUserCircle size={50} style={{ color: "#777" }} className="me-3" />
//               <div>
//                 <h6 className="mb-0">{user.username}</h6>
//                 <small className="text-muted">{user.email}</small>
//               </div>
//             </div>
//             <hr />

//             {/* Details */}
//             <div className="mb-2">
//               <strong>Gender:</strong> <span className="text-muted">{user.gender}</span>
//             </div>
//             <div className="mb-2">
//               <strong>User Since:</strong> <span className="text-muted">{user.userSince}</span>
//             </div>

//             {/* Editable Risk Appetite */}
//             <div className="mb-3">
//               <strong>Risk Appetite:</strong>
//               <select
//                 className="form-select form-select-sm mt-1"
//                 value={riskAppetite}
//                 onChange={(e) => setRiskAppetite(e.target.value)}
//               >
//                 {riskOptions.map((opt) => (
//                   <option key={opt.label} value={opt.label}>
//                     {opt.emoji} {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Save Button */}
//             <button
//               className="btn btn-sm btn-primary w-100"
//               onClick={() => alert(`Risk appetite set to: ${riskAppetite}`)}
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProfileMenu;
