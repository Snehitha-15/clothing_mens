// src/Router/AppRoutes.js
import React, { useState, useEffect } from "react";
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

import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../Redux/categorySlice";
import { fetchProducts } from "../Redux/productSlice";

const AppContent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);   // subcategory name
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tree: categoriesTree } = useSelector((state) => state.categories);

  const isCheckoutPage = ["/cart", "/address", "/payment"].includes(location.pathname);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Called when user picks subcategory from dropdown (e.g. "Shirt")
  const handleCategorySelect = (subcategoryName) => {
    setSelectedCategory(subcategoryName);
    setSearchQuery("");
    navigate("/products");
  };

  return (
    <>
      {user && !isCheckoutPage && (
        <Header
          categoriesTree={categoriesTree}
          onSubCategorySelect={handleCategorySelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
                searchQuery={searchQuery}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
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
