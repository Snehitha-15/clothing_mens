import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "../components/Header/Header";
import CheckoutHeader from "../components/Header/CheckoutHeader";
import Footer from "../components/footer/Footer";

import Products from "../Pages/products/Products";
import AddressPage from "../Pages/Checkout/Address";
import PaymentPage from "../Pages/Checkout/Payment";
import OrderSuccess from "../Pages/Checkout/OrderSuccess";
import Cart from "../Pages/cart/Cart";
import Login from "../Pages/Login/Login";
import HomePage from "../Pages/HomePage";

// List of categories
const categoryList = [
  "Shirts",
  "Pants",
  "T-Shirts",
  "Sweaters",
  "Shorts",
  "Jackets",
  "Jeans",
  "Sweatshirts",
  "Blazers",
  "Suits",
];

const AppContent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isCheckoutPage =
    location.pathname === "/cart" ||
    location.pathname === "/address" ||
    location.pathname === "/payment";

  // When a category is clicked
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigate("/products");
  };

  return (
    <>
      {/* Render appropriate header */}
      {isCheckoutPage ? (
        <CheckoutHeader />
      ) : (
        <Header categories={categoryList} onCategorySelect={handleCategorySelect} />
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={<Products selectedCategory={selectedCategory} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* Render footer only for non-checkout pages */}
      {!isCheckoutPage && <Footer />}
    </>
  );
};

const AppRoutes = () => (
  <Router>
    <AppContent />
  </Router>
);

export default AppRoutes;
