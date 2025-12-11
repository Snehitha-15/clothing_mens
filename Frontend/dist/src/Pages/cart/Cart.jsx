import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table } from "reactstrap";
import { useNavigate } from "react-router-dom";

import {
  fetchCart,
  removeCartItem,
  addOrUpdateCart,
  clearCart
} from "../../Redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (items.length === 0) {
    return <p className="text-center mt-5">🛒 Your cart is empty.</p>;
  }

  const handleIncrement = (item) => {
    dispatch(
      addOrUpdateCart({
        variant: item.variant.id,
        quantity: item.quantity + 1
      })
    );
  };

  const handleDecrement = (item) => {
    if (item.quantity <= 1) return;

    dispatch(
      addOrUpdateCart({
        variant: item.variant.id,
        quantity: item.quantity - 1
      })
    );
  };

  const handlePlaceOrder = () => {
    navigate("/address");
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.variant.product.price * item.quantity,
    0
  );

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
                  src={
                      item.variant.product.images?.[0] ||
                      item.variant.product.image ||
                      "/placeholder.png"
                    }

                  width="70"
                  height="70"
                  style={{ objectFit: "cover", borderRadius: "5px" }}
                  alt={item.variant.product.name}
                />
              </td>

              <td>
                <strong>{item.variant.product.name}</strong>
                <p style={{ fontSize: "13px", color: "#555" }}>
                  Size: {item.variant.size} | Color: {item.variant.color}
                </p>
              </td>

              <td>₹{item.variant.product.price}</td>

              <td className="text-center">
                <Button
                  color="secondary"
                  size="sm"
                  onClick={() => handleDecrement(item)}
                >
                  –
                </Button>

                <span className="mx-2">{item.quantity}</span>

                <Button
                  color="secondary"
                  size="sm"
                  onClick={() => handleIncrement(item)}
                >
                  +
                </Button>
              </td>

              <td>₹{item.variant.product.price * item.quantity}</td>

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
        <h5>Total Amount: ₹{totalPrice}</h5>

        <div>
          <Button color="danger" className="me-2" onClick={() => dispatch(clearCart())}>
            Clear Cart
          </Button>
          <Button color="success" onClick={handlePlaceOrder}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
