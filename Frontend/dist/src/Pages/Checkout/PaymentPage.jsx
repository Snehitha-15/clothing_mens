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

  const totalAmount = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  // IMPORTANT → CartItem IDs
  const cartItemIds = items.map((i) => i.id);

  /* ================================
         COD ORDER
  ================================= */
  const placeCODOrder = async () => {
    const res = await dispatch(
      createOrder({
        items: cartItemIds,
        payment_method: "COD",
        address_id: savedAddress.id,
      })
    );

    if (!createOrder.fulfilled.match(res)) {
      alert("Error placing COD order");
      return;
    }

    dispatch(clearCart());

    navigate("/order-success", {
      state: { items, totalAmount, paymentMethod: "COD" },
    });
  };

  /* ================================
        RAZORPAY ORDER
  ================================= */
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

    // SAVE ITEMS BEFORE CLEARING CART
    const preservedItems = JSON.parse(JSON.stringify(items));

    const options = {
      key: orderData.key,
      amount: orderData.amount_paisa,
      currency: "INR",
      name: "MENZSTYLE",
      description: "Order Payment",
      order_id: orderData.razorpay_order_id,

      handler: async function (response) {
        const verifyRes = await dispatch(
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            items: cartItemIds,
            address_id: savedAddress.id,
          })
        );

        if (verifyPayment.fulfilled.match(verifyRes)) {
          // NOW clear cart AFTER verification
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

  /* ================================
        HANDLE ORDER
  ================================= */
  const handlePlaceOrder = () => {
    if (!savedAddress) return alert("Please select an address");
    if (items.length === 0) return alert("Your cart is empty");

    if (paymentMethod === "cod") placeCODOrder();
    else startOnlinePayment();
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-left">
        <h4>Choose Payment Mode</h4>

        <div className="address-summary p-3 border rounded bg-light mb-3">
          <h5>Deliver To:</h5>
          <strong>{savedAddress.full_name}</strong>
          <p>
            {savedAddress.address_line1}, {savedAddress.city}<br />
            {savedAddress.state} – {savedAddress.postal_code}
          </p>
        </div>

        <div className="payment-methods">
          {["upi", "card", "netbanking", "cod"].map((method) => (
            <div
              key={method}
              className={`method-card ${
                paymentMethod === method ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod(method)}
            >
              <input
                type="radio"
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              <span>{method.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <button className="place-order-btn mt-3" onClick={handlePlaceOrder}>
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
