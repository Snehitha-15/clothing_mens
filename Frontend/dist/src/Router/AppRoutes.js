// src/Router/AppRoutes.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login/Login";
import Signup from "../Pages/Login/Signup";
import ProtectedRoute from "../ProtectedRoute";
import PublicRoute from "../PublicRoute";
import Wishlist from "../Pages/Wishlist/wishlist";

import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../Redux/categorySlice";
import { fetchProducts } from "../Redux/productSlice";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tree: categoriesTree } = useSelector((state) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🟢 Fetch Public APIs (No login needed)
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const hideLayoutRoutes = ["/login", "/signup"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  const isCheckoutPage = ["/cart", "/address", "/payment"].includes(
    location.pathname
  );

  return (
    <>
      {/* Header only when logged in */}
      {user && !hideLayout && !isCheckoutPage && (
        <Header
          categoriesTree={categoriesTree}
          onSubCategorySelect={(subcategoryName) => {
            setSelectedCategory(subcategoryName);
            setSearchQuery("");
            navigate("/products");
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {user && isCheckoutPage && <CheckoutHeader />}

      <Routes>
        {/* Public Routes */}
         <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={<Products selectedCategory={selectedCategory} searchQuery={searchQuery} />}
        />

        {/* Protected Routes */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/address" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer only when logged in */}
       {user && !hideLayout && !isCheckoutPage && <Footer />}

    </>
  );
};

export default function AppRoutes() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
