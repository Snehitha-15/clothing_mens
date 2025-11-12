import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment");
  };

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4">🏠 Shipping Address</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
        <FormGroup>
          <Label for="name">Full Name</Label>
          <Input id="name" required />
        </FormGroup>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input id="address" required />
        </FormGroup>
        <FormGroup>
          <Label for="city">City</Label>
          <Input id="city" required />
        </FormGroup>
        <FormGroup>
          <Label for="pincode">Pincode</Label>
          <Input id="pincode" required />
        </FormGroup>
        <div className="text-center mt-4">
          <Button color="dark" type="submit">
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddressPage;
