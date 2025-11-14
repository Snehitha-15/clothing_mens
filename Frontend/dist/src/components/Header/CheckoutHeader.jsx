import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import "./CheckoutHeader.css";

const CheckoutHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getStepStyle = (path) => {
    const isActive = currentPath === path;
    return {
      color: isActive ? "#febd69" : "#ddd",
      borderBottom: isActive ? "2px solid #febd69" : "none",
      paddingBottom: "1px",
      textDecoration: "none",
      fontWeight: isActive ? "600" : "500",
      transition: "all 0.3s ease",
    };
  };

  const getLineStyle = (fromPath) => {
    const order = ["/cart", "/address", "/payment"];
    const currentIndex = order.indexOf(currentPath);
    const fromIndex = order.indexOf(fromPath);
    return {
      color: currentIndex > fromIndex ? "#febd69" : "#666",
      transition: "color 0.3s ease",
    };
  };

  return (
    <header className="checkout-header">
      <div className="checkout-container">
        {/* LEFT — LOGO */}
        <div className="checkout-logo">
          <Link to="/" className="logo-link">
            <h2 className="checkout-brand">
              MENZ<span className="highlight">STYLE</span>
            </h2>
          </Link>
        </div>

        {/* CENTER — STEPS */}
        <nav className="checkout-steps">
          <Link to="/cart" style={getStepStyle("/cart")}>
            BAG
          </Link>
          <span style={getLineStyle("/cart")}>────</span>
          <Link to="/address" style={getStepStyle("/address")}>
            ADDRESS
          </Link>
          <span style={getLineStyle("/address")}>────</span>
          <Link to="/payment" style={getStepStyle("/payment")}>
            PAYMENT
          </Link>
        </nav>

        {/* RIGHT — SECURE */}
        <div className="checkout-secure">
          <FaLock className="secure-icon" />
          <span>100% SECURE</span>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
