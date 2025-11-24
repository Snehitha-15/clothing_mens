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
import Signup from "../Pages/Login/Signup";

import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../Redux/categorySlice";
import { fetchProducts } from "../Redux/productSlice";

const AppContent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tree: categoriesTree } = useSelector((state) => state.categories);

  // 🚫 Routes where we hide Footer
  const noFooterRoutes = ["/login", "/signup", "/cart", "/address", "/payment"];
  const hideFooter = noFooterRoutes.includes(location.pathname);

  // 🚫 Routes where we show Checkout Header
  const isCheckoutPage = ["/cart", "/address", "/payment"].includes(location.pathname);

  // Fetch initial categories/products
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategorySelect = (subcategoryName) => {
    setSelectedCategory(subcategoryName);
    setSearchQuery("");
    navigate("/products");
  };

  return (
    <>
      {/* Header Logic */}
      {user && !isCheckoutPage && (
        <Header
          categoriesTree={categoriesTree}
          onSubCategorySelect={handleCategorySelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      {user && isCheckoutPage && <CheckoutHeader />}

      {/* Routes */}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<HomePage />} />

        <Route
          path="/products"
          element={<Products selectedCategory={selectedCategory} searchQuery={searchQuery} />}
        />

        <Route path="/cart" element={<Cart />} />

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

      {/* Footer (hidden on login, signup, checkout pages) */}
      {!hideFooter && <Footer />}
    </>
  );
};

const AppRoutes = () => (
  <Router>
    <AppContent />
  </Router>
);

export default AppRoutes;
