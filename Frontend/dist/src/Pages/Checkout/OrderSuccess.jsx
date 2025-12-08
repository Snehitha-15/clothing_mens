// src/Pages/Checkout/OrderSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    items = [],
    totalAmount = 0,
    paymentMethod = "",
  } = location.state || {};

  return (
    <div className="container py-5 text-center">
      <h2 className="text-success mb-3">🎉 Order Placed Successfully!</h2>
      <p className="text-muted mb-4">
        Thank you for shopping with <strong>MENZSTYLE</strong>! Your order has
        been confirmed.
      </p>

      {items.length > 0 && (
        <Table
          bordered
          responsive
          style={{ maxWidth: "700px", margin: "20px auto" }}
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const name = item.product?.name ?? item.name ?? "-";
              const qty = item.quantity ?? 1;
              const unitPrice = item.product?.price ?? item.price ?? 0;
              const lineTotal = unitPrice * qty;

              return (
                <tr key={item.id || idx}>
                  <td>{name}</td>
                  <td>{qty}</td>
                  <td>₹{lineTotal.toFixed(2)}</td>
                </tr>
              );
            })}

            <tr>
              <td colSpan="2" className="text-end fw-bold">
                Total
              </td>
              <td className="fw-bold">₹{totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
      )}

      <p className="mt-3">
        <strong>Payment Method:</strong>{" "}
        {paymentMethod ? paymentMethod.toUpperCase() : "-"}
      </p>

      <Button color="primary" className="mt-4" onClick={() => navigate("/")}>
        Continue Shopping
      </Button>
    </div>
  );
};

export default OrderSuccess;
