import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// ✅ Components
import Header from "../components/Header/Header";
import CheckoutHeader from "../components/Header/CheckoutHeader";
import Footer from "../components/footer/Footer";


// ✅ Pages
// import CartPage from "../Pages/Checkout/CartPage";
import Products from "../Pages/products/Products";
import AddressPage from "../Pages/Checkout/Address";
import PaymentPage from "../Pages/Checkout/Payment";
import OrderSuccess from "../Pages/Checkout/OrderSuccess";
import Cart from "../Pages/cart/Cart"
import ProfilePage from "../components/profile/Profilepage";

// ✅ Category list (for Header)
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
  const [selectedCategory, setSelectedCategory] = useState("Shirts");
  const location = useLocation();

  // ✅ Detect checkout-related pages
  const isCheckoutPage =
    location.pathname === "/cart" ||
    location.pathname === "/address" ||
    location.pathname === "/payment";

  return (
    <>
      {/* ✅ Conditionally show headers */}
      {isCheckoutPage ? (
        <CheckoutHeader />
      ) : (
        <Header
          categories={categoryList}
          onCategorySelect={setSelectedCategory}
        />
      )}

      {/* ✅ Routes */}
      <Routes>
        <Route
          path="/"
          element={<Products selectedCategory={selectedCategory} />}
        />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route
          path="/profile"
          element={<ProfilePage/>}
        />
      </Routes>

      {/* ✅ Footer appears only on non-checkout pages */}
      {!isCheckoutPage && <Footer />}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default AppRoutes;