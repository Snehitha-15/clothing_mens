import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table } from "reactstrap";
import { useNavigate } from "react-router-dom";

import {
  increaseQuantity,
  decreaseQuantity,
  clearCart
} from "../../Redux/cartSlice";

import { fetchCart, removeCartItem } from "../../Redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalAmount, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert("Cart is empty!");
      return;
    }
    navigate("/address");
  };

  if (items.length === 0) {
    return <p className="text-center mt-5">🛒 Your cart is empty.</p>;
  }

  return (
    <div className="cart-container p-4">
      <h3 className="text-center mb-3">🛒 Your Cart</h3>

      <Table responsive hover>
        <thead style={{ backgroundColor: "#f8f9fa" }}>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th style={{ width: "150px" }}>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  width="70"
                  height="70"
                  style={{ objectFit: "cover", borderRadius: "5px" }}
                />
              </td>

              <td>
                <strong>{item.product?.name}</strong>
                <p style={{ fontSize: "12px", color: "#555" }}>
                  {item.product?.description}
                </p>
              </td>

              <td>₹{item.product?.price}</td>

              <td className="text-center">
                <Button
                  color="secondary"
                  size="sm"
                  onClick={() => dispatch(decreaseQuantity(item.id))}
                  style={{ marginRight: "5px" }}
                >
                  –
                </Button>

                <span>{item.quantity}</span>

                <Button
                  color="secondary"
                  size="sm"
                  onClick={() => dispatch(increaseQuantity(item.id))}
                  style={{ marginLeft: "5px" }}
                >
                  +
                </Button>
              </td>

              <td>₹{item.product?.price * item.quantity}</td>

              <td>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => dispatch(removeCartItem(item.id))}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div
        className="d-flex justify-content-between align-items-center mt-4"
        style={{ borderTop: "1px solid #ddd", paddingTop: "15px" }}
      >
        <h5>
          Total Amount: ₹
          {items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
        </h5>

        <div>
          <Button color="danger" className="me-2" onClick={() => dispatch(clearCart())}>
            Clear Cart
          </Button>
          <Button color="success" onClick={handlePlaceOrder}>
            Proceed to Buy
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Cart;
