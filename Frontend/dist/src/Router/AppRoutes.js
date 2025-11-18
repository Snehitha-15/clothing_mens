// src/Router/AppRoutes.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Header from "../components/Header/Header";
import CheckoutHeader from "../components/Header/CheckoutHeader";
import Footer from "../components/footer/Footer";

import Products from "../Pages/products/Products";
import AddressPage from "../Pages/Checkout/Address";
import PaymentPage from "../Pages/Checkout/Payment";
import OrderSuccess from "../Pages/Checkout/OrderSuccess";
import Cart from "../Pages/cart/Cart";
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login/Login";
import ProtectedRoute from "../ProtectedRoute";
import { useSelector } from "react-redux";

const categoryList = [
  "Shirts", "Pants", "T-Shirts", "Sweaters", "Shorts",
  "Jackets", "Jeans", "Sweatshirts", "Blazers", "Suits"
];

const AppContent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");  // 🔥 ADDED HERE

  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isCheckoutPage = ["/cart", "/address", "/payment"].includes(location.pathname);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // 🔥 Clear search when category is selected
    navigate("/products");
  };

  return (
    <>
      {/* Header (send searchQuery & setSearchQuery to Header) */}
      {user && !isCheckoutPage && (
        <Header
          categories={categoryList}
          onCategorySelect={handleCategorySelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery} // 🔥 Now Header can update search
        />
      )}

      {user && isCheckoutPage && <CheckoutHeader />}

      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products
                selectedCategory={selectedCategory}
                searchQuery={searchQuery} // 🔥 Now search comes here
              />
            </ProtectedRoute>
          }
        />

        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/address" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
      </Routes>

      {user && !isCheckoutPage && <Footer />}
    </>
  );
};

const AppRoutes = () => (
  <Router>
    <AppContent />
  </Router>
);

export default AppRoutes;
