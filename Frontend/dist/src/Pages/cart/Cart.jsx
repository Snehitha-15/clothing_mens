import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table } from "reactstrap";
import { useNavigate } from "react-router-dom";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../../Redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
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
                  src={item.image}
                  alt={item.name}
                  width="70"
                  height="70"
                  style={{ objectFit: "cover", borderRadius: "5px" }}
                />
              </td>
              <td>
                <strong>{item.name}</strong>
                <p style={{ fontSize: "12px", color: "#555" }}>{item.description}</p>
              </td>
              <td>₹{item.price}</td>
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
              <td>₹{item.price * item.quantity}</td>
              <td>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => dispatch(removeFromCart(item.id))}
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
        <h5>Total Amount: ₹{totalAmount}</h5>
        <div>
          <Button
            color="danger"
            className="me-2"
            onClick={() => dispatch(clearCart())}
          >
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
