import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../Redux/cartSlice";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const savedAddress = JSON.parse(sessionStorage.getItem("shippingAddress"));

  const handlePayment = (e) => {
    e.preventDefault();
    navigate("/order-success", { state: { items, totalAmount, paymentMethod } });
    dispatch(clearCart());
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-left">
        <h4>Choose Payment Mode</h4>

        {/* 🏠 Show delivery address */}
        {savedAddress && (
          <div className="address-summary mb-4 p-3 border rounded bg-light">
            <h5 className="mb-2">Deliver To:</h5>
            <p className="mb-0">
              <strong>{savedAddress.name}</strong><br />
              {savedAddress.address}, {savedAddress.city} - {savedAddress.pincode}
            </p>
          </div>
        )}

        <div className="payment-methods">
          {[
            { id: "upi", label: "💸 UPI (Google Pay, PhonePe, Paytm)" },
            { id: "card", label: "💳 Credit / Debit Card" },
            { id: "netbanking", label: "🏦 Net Banking" },
            { id: "cod", label: "💵 Cash on Delivery (COD)" },
          ].map((method) => (
            <div
              key={method.id}
              className={`method-card ${
                paymentMethod === method.id ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === method.id}
                onChange={() => setPaymentMethod(method.id)}
              />
              <span>{method.label}</span>
            </div>
          ))}
        </div>

        <button className="place-order-btn" onClick={handlePayment}>
          Place Order
        </button>
      </div>

      <div className="payment-summary">
        <h4>PRICE DETAILS</h4>
        <div className="summary-item">
          <span>Total MRP</span>
          <span>₹{(totalAmount + 500).toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span>Discount on MRP</span>
          <span className="discount">-₹500</span>
        </div>
        <div className="summary-item">
          <span>Platform Fee</span>
          <span>₹23</span>
        </div>
        <div className="summary-item">
          <span>Cash on Delivery Fee</span>
          <span>₹10</span>
        </div>
        <hr />
        <div className="summary-total">
          <strong>Total Amount</strong>
          <strong>₹{(totalAmount + 33).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
