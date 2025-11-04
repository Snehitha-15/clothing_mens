import React, { useState } from "react";
import { Button, FormGroup, Label, Input, Form } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../Redux/cartSlice";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePayment = (e) => {
    e.preventDefault();

    // ✅ Navigate to order success page and clear the cart
    navigate("/order-success", { state: { items, totalAmount, paymentMethod } });
    dispatch(clearCart());
  };

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <h3 className="text-center mb-4">💳 Payment</h3>
      <p className="text-center mb-4">Total amount to pay: ₹{totalAmount}</p>

      <Form onSubmit={handlePayment}>
        <FormGroup>
          <Label className="fw-bold mb-2">Select Payment Method</Label>

          <div className="d-flex flex-column gap-2">
            <Label check>
              <Input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />{" "}
              UPI (Google Pay, PhonePe, Paytm)
            </Label>

            <Label check>
              <Input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />{" "}
              Credit / Debit Card
            </Label>

            <Label check>
              <Input
                type="radio"
                name="payment"
                value="netbanking"
                checked={paymentMethod === "netbanking"}
                onChange={() => setPaymentMethod("netbanking")}
              />{" "}
              Net Banking
            </Label>

            <Label check>
              <Input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />{" "}
              Cash on Delivery (COD)
            </Label>
          </div>
        </FormGroup>

        <div className="text-center mt-4">
          <Button color="success" type="submit">
            Confirm & Place Order
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PaymentPage;
