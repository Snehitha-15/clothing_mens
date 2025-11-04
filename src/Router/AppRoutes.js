import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../footer/Footer";
import Products from "../Pages/products/Products";
import ProfilePage from "../components/profile/Profilepage"; // ✅ import your real profile

const Home = () => <Products />;
const Cart = () => <div className="p-4 text-center">🛒 Cart Page</div>;

const AppRoutes = () => (
  <Router>
    {/* Header will appear on all pages */}
    <Header />

    {/* Main content */}
    <main style={{ minHeight: "80vh", paddingTop: "20px" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* ✅ updated */}
        <Route path="/cart" element={<Cart />} />
        
        </Routes>
    </main>

    {/* Footer will appear on all pages */}
    <Footer />
  </Router>
);

export default AppRoutes;
