import React, { useState } from "react";
import api from "../api";

function TradeForm() {
  const [trade, setTrade] = useState({
    stockTicker: "",
    price: "",
    volume: "",
    buyOrSell: "BUY"
  });

  const handleChange = (e) => {
    setTrade({ ...trade, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/trades", trade);
      alert("✅ Trade placed successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error placing trade");
    }
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="card-title mb-4">⚡ Quick Order</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <input
              name="stockTicker"
              className="form-control"
              placeholder="Ticker"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="price"
              type="number"
              className="form-control"
              placeholder="Price"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="volume"
              type="number"
              className="form-control"
              placeholder="Volume"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <select
              name="buyOrSell"
              className="form-select"
              onChange={handleChange}
              value={trade.buyOrSell}
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>
          <div className="col-md-1 d-grid">
            <button type="submit" className="btn btn-primary">Go</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TradeForm;

// import React, { useState } from "react";
// import api from "../api";

// function TradeForm() {
//   const [trade, setTrade] = useState({
//     stockTicker: "",
//     price: "",
//     volume: "",
//     buyOrSell: "BUY"
//   });

//   const handleChange = (e) => {
//     setTrade({ ...trade, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       await api.post("/trades", trade);
//       alert("Trade placed successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Error placing trade");
//     }
//   };

//   return (
//     <div>
//       <input name="stockTicker" placeholder="Ticker" onChange={handleChange} />
//       <input name="price" type="number" placeholder="Price" onChange={handleChange} />
//       <input name="volume" type="number" placeholder="Volume" onChange={handleChange} />
//       <select name="buyOrSell" onChange={handleChange}>
//         <option value="BUY">BUY</option>
//         <option value="SELL">SELL</option>
//       </select>
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// }

// export default TradeForm;
