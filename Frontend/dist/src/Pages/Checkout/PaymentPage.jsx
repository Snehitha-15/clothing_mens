import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearCart } from "../../Redux/cartSlice";
import { createOrder, verifyPayment } from "../../Redux/checkoutSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { addresses } = useSelector((state) => state.address);

  const savedAddress = addresses?.[0];
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // PRICE CALCULATION
  const totalAmount = items.reduce(
    (sum, i) => sum + i.variant.product.price * i.quantity,
    0
  );

  const cartItemIds = items.map((i) => i.id);

  /* ===============================
        COD ORDER FUNCTION
     =============================== */
  const placeCODOrder = async () => {
    const res = await dispatch(
      createOrder({
        items: cartItemIds,
        payment_method: "COD",
        address_id: savedAddress.id,
      })
    );

    if (createOrder.fulfilled.match(res)) {
      dispatch(clearCart());
      navigate("/order-success", {
        state: {
          items,
          totalAmount,
          paymentMethod: "COD",
        },
      });
    } else {
      alert("COD order failed");
    }
  };

  /* ===============================
        RAZORPAY ONLINE PAYMENT
     =============================== */
  const startOnlinePayment = async () => {
    const res = await dispatch(
      createOrder({
        items: cartItemIds,
        payment_method: "RAZORPAY",
        address_id: savedAddress.id,
      })
    );

    if (!createOrder.fulfilled.match(res)) {
      alert("Error creating Razorpay order");
      return;
    }

    const orderData = res.payload;
    const preservedItems = JSON.parse(JSON.stringify(items));

    const options = {
      key: orderData.key,
      amount: orderData.amount_paisa,
      currency: "INR",
      name: "MENZSTYLE",
      description: "Order Payment",
      order_id: orderData.razorpay_order_id,

      handler: async function (response) {
        // BACKEND EXPECTS ONLY IDS → SEND ONLY IDS
        const itemIdsOnly = preservedItems.map((item) => item.id);

        const verifyRes = await dispatch(
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,

            items: itemIdsOnly, // 🔥 FIXED — only IDs
            address_id: savedAddress.id,
          })
        );

        if (verifyPayment.fulfilled.match(verifyRes)) {
          dispatch(clearCart());
          navigate("/order-success", {
            state: {
              items: preservedItems,
              totalAmount,
              paymentMethod: "ONLINE",
            },
          });
        } else {
          alert("Payment verification failed");
        }
      },

      prefill: {
        name: savedAddress.full_name,
        email: "demo@example.com",
        contact: savedAddress.phone,
      },

      theme: { color: "#111" },
    };

    new window.Razorpay(options).open();
  };

  /* ===============================
        MAIN PAYMENT HANDLER
     =============================== */
  const handlePayment = () => {
    if (paymentMethod === "cod") placeCODOrder();
    else startOnlinePayment();
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-left">
        <h4>Choose Payment Mode</h4>

        <div className="address-summary p-3 border rounded bg-light mb-3">
          <h5>Deliver To:</h5>
          <strong>{savedAddress?.full_name}</strong>
          <p>
            {savedAddress?.address_line1}, {savedAddress?.city}
            <br />
            {savedAddress?.state} – {savedAddress?.postal_code}
          </p>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          {[
            { key: "razorpay", label: "Online Payment" },
            { key: "cod", label: "Cash On Delivery" },
          ].map((m) => (
            <div
              key={m.key}
              className={`method-card ${
                paymentMethod === m.key ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod(m.key)}
            >
              <input
                type="radio"
                checked={paymentMethod === m.key}
                onChange={() => setPaymentMethod(m.key)}
              />
              <span>{m.label}</span>
            </div>
          ))}
        </div>

        {/* FIXED BUTTON */}
        <button className="place-order-btn mt-3" onClick={handlePayment}>
          Place Order
        </button>
      </div>

      <div className="payment-summary">
        <h4>PRICE DETAILS</h4>

        <div className="summary-item">
          <span>Total MRP</span>
          <span>₹{totalAmount}</span>
        </div>

        <div className="summary-item">
          <span>Platform Fee</span>
          <span>₹23</span>
        </div>

        <hr />

        <div className="summary-total">
          <strong>Total Amount</strong>
          <strong>₹{totalAmount + 23}</strong>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
