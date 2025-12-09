import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, fetchAddresses } from "../../Redux/addressSlice";
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(addAddress(form));

    if (addAddress.fulfilled.match(result)) {
      navigate("/payment");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4 px-3">
      <div
        className="p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "12px",
          background: "#ffffff",
        }}
      >
        <h3 className="text-center mb-4 fw-bold">Shipping Address</h3>

        <Form onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <FormGroup className="mb-3">
            <Label className="fw-semibold">Full Name</Label>
            <Input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="p-3"
              required
            />
          </FormGroup>

          {/* PHONE */}
          <FormGroup className="mb-3">
            <Label className="fw-semibold">Phone Number</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              maxLength="10"
              className="p-3"
              required
            />
          </FormGroup>

          {/* ADDRESS LINE 1 */}
          <FormGroup className="mb-3">
            <Label className="fw-semibold">Address Line 1</Label>
            <Input
              name="address_line1"
              value={form.address_line1}
              onChange={handleChange}
              placeholder="Flat, House no., Building, Street"
              className="p-3"
              required
            />
          </FormGroup>

          {/* ADDRESS LINE 2 */}
          <FormGroup className="mb-3">
            <Label className="fw-semibold">Address Line 2</Label>
            <Input
              name="address_line2"
              value={form.address_line2}
              onChange={handleChange}
              placeholder="Area, Colony, Landmark (Optional)"
              className="p-3"
            />
          </FormGroup>

          {/* CITY & STATE */}
          <div className="d-flex gap-3">
            <FormGroup className="mb-3 w-50">
              <Label className="fw-semibold">City</Label>
              <Input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="p-3"
                required
              />
            </FormGroup>

            <FormGroup className="mb-3 w-50">
              <Label className="fw-semibold">State</Label>
              <Input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="p-3"
                required
              />
            </FormGroup>
          </div>

          {/* PINCODE */}
          <FormGroup className="mb-4">
            <Label className="fw-semibold">Pincode</Label>
            <Input
              name="postal_code"
              value={form.postal_code}
              onChange={handleChange}
              placeholder="Enter pincode"
              className="p-3"
              required
            />
          </FormGroup>

          {/* SUBMIT */}
          <Button
            color="dark"
            type="submit"
            className="w-100 p-3 fw-bold"
            style={{ borderRadius: "10px", fontSize: "1.1rem" }}
          >
            Continue to Payment
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddressPage;
