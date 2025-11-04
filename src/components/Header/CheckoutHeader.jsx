import React from "react";
import { Link, useLocation } from "react-router-dom";

const CheckoutHeader = () => {
  const location = useLocation();

  // Determine which step is active based on current route
  const currentPath = location.pathname;

  const getStepStyle = (stepPath) => {
    const isActive = currentPath === stepPath;
    return {
      color: isActive ? "#00b5ad" : "#555",
      borderBottom: isActive ? "2px solid #00b5ad" : "none",
      paddingBottom: "3px",
      cursor: "pointer",
      textDecoration: "none",
      fontWeight: isActive ? "600" : "500",
    };
  };

  const getLineStyle = (fromPath) => {
    const order = ["/cart", "/address", "/payment"];
    const currentIndex = order.indexOf(currentPath);
    const fromIndex = order.indexOf(fromPath);
    return {
      color: currentIndex > fromIndex ? "#00b5ad" : "#999",
      transition: "color 0.3s ease",
    };
  };

  return (
    <div
      className="checkout-header d-flex align-items-center justify-content-between px-5 py-3"
      style={{
        borderBottom: "1px solid #eee",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Logo */}
      <div>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "22px", color: "#000" }}>
            MENZ<span style={{ color: "#dc3545" }}>STYLE</span>
          </h2>
        </Link>
      </div>

      {/* Steps (interactive & dynamic) */}
      <div
        className="checkout-steps d-flex align-items-center gap-4"
        style={{
          letterSpacing: "2px",
          fontWeight: "500",
          fontSize: "14px",
        }}
      >
        <Link to="/cart" style={getStepStyle("/cart")}>
          BAG
        </Link>
        <div style={getLineStyle("/cart")}>---------</div>
        <Link to="/address" style={getStepStyle("/address")}>
          ADDRESS
        </Link>
        <div style={getLineStyle("/address")}>---------</div>
        <Link to="/payment" style={getStepStyle("/payment")}>
          PAYMENT
        </Link>
      </div>

      {/* Secure section */}
      <div
        className="align-items-center gap-2"
        style={{ color: "#444", fontSize: "14px", letterSpacing: "2px" }}
      >
        <span role="img" aria-label="lock" style={{ color: "#00b5ad" }}>
          🔒
        </span>
        <span style={{ fontWeight: "500" }}>100% SECURE</span>
      </div>
    </div>
  );
};

export default CheckoutHeader;
