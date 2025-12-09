// src/Pages/myOrders/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, cancelOrder, trackOrder } from "../../Redux/myOrderSlice";
import OrderTracking from "../myOrders/orderTracking";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { list: orders, loading, error } = useSelector((state) => state.orders);

  const [openTracking, setOpenTracking] = useState(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleCancel = (orderId) => {
    console.log("📍 Cancel Clicked:", orderId);
    dispatch(cancelOrder(orderId));
  };

  const handleTrack = (orderId) => {
    console.log("📍 Track Order Clicked:", orderId);
    dispatch(trackOrder(orderId));
    setOpenTracking(orderId);
  };

  if (loading) return <p className="text-center">Loading your orders...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card p-4 mb-4 shadow-sm">

            {/* ORDER HEADER */}
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold">Order #{order.id}</h5>
              <p className="text-success fw-bold">₹{order.total}.00</p>
            </div>

            <p>
              <strong>Payment Method:</strong> {order.payment_method}
            </p>

            {/* BUTTONS */}
            <div className="d-flex gap-3 mb-3">

              {/* FIXED CANCEL ORDER BUTTON */}
              {order.status === "CANCELLED" ? (
                <div
                  className="w-50 text-center fw-bold text-danger py-2"
                  style={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                >
                  Order Cancelled
                </div>
              ) : (
                <button
                  className="btn btn-dark w-50"
                  onClick={() => handleCancel(order.id)}
                >
                  Cancel Order
                </button>
              )}

              {/* TRACK ORDER */}
              <button
                className="btn btn-dark w-50"
                onClick={() => handleTrack(order.id)}
              >
                Track Order
              </button>
            </div>

            {/* ORDER ITEMS */}
            {order.items.map((item) => (
              <div key={item.id} className="d-flex mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />

                <div className="ms-3">
                  <h6 className="fw-bold">{item.name}</h6>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
              </div>
            ))}

            {/* TRACKING SECTION */}
            {openTracking === order.id && (
              <OrderTracking tracking={order.tracking} />
            )}

          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
