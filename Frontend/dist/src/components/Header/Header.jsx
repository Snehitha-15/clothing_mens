// src/components/Header/Header.jsx

import React from "react";
import {
  Navbar,
  Nav,
  NavItem,
  Input,
  Button,
  Collapse,
  NavbarToggler,
  Container,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import "./Header.css";

const Header = ({ categories = [], onCategorySelect, searchQuery, setSearchQuery }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [location, setLocation] = React.useState("Tirupati");
  const [activeCategory, setActiveCategory] = React.useState("");

  const cartItems = useSelector((state) => state.cart.items || []);
  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navigate = useNavigate();

  // Navigate to homepage on logo click
  const handleLogoClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  // Change delivery location
  const handleLocationClick = () => {
    const newLoc = prompt("Enter your delivery location:", location);
    if (newLoc && newLoc.trim() !== "") setLocation(newLoc);
  };

  // Category select
  const handleCategorySelectLocal = (cat) => {
    setActiveCategory(cat);
    if (onCategorySelect) onCategorySelect(cat);
    navigate("/products");
  };

  // Search Handler
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <header className="header-wrapper">
      {/* ================= TOP NAV ================= */}
      <Navbar color="dark" dark expand="md" className="amazon-topbar py-2">
        <Container fluid className="px-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap w-100">

            {/* LEFT — LOGO + LOCATION */}
            <div className="d-flex align-items-center flex-shrink-0 gap-2">
              <div onClick={handleLogoClick} className="logo text-white" style={{ cursor: "pointer" }}>
                <h2 className="brand mb-0">
                  MENZ<span className="text-warning">STYLE</span>
                </h2>
              </div>
              <div
                className="d-flex align-items-center gap-1 location-box"
                onClick={handleLocationClick}
                style={{ cursor: "pointer" }}
              >
                <FaMapMarkerAlt />
                <span className="location-text">Deliver to {location}</span>
              </div>
            </div>

            {/* RIGHT — SEARCH | PROFILE | WISHLIST | CART */}
            <div className="d-flex align-items-center gap-3 ms-auto right-section">

              {/* SEARCH BAR */}
              <div className="search-bar d-flex align-items-center bg-white rounded-pill px-3">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // 🔥 Lifts search value to AppRoutes
                  className="border-0 flex-grow-1"
                />
                <Button
                  color="warning"
                  className="border-0 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "38px", height: "38px" }}
                  onClick={handleSearch}
                >
                  <FaSearch color="black" />
                </Button>
              </div>

              {/* PROFILE ICON */}
              <Link to="/profile" className="text-white text-decoration-none d-flex align-items-center">
                <FaUser size={18} />
              </Link>

              {/* ❤ WISHLIST */}
              <Link to="/wishlist" className="text-white text-decoration-none position-relative d-flex align-items-center">
                <FaHeart size={18} />
                {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
              </Link>

              {/* 🛒 CART */}
              <Link to="/cart" className="text-white text-decoration-none position-relative d-flex align-items-center">
                <FaShoppingCart size={18} />
                {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
              </Link>

              {/* MENU TOGGLER */}
              <NavbarToggler onClick={() => setIsOpen(!isOpen)} className="border-0 d-md-none">
                <FaBars color="white" />
              </NavbarToggler>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* ================= CATEGORY NAV ================= */}
      <Navbar color="light" light expand="md" className="amazon-categorybar shadow-sm py-0">
        <Container fluid className="px-3">
          <Collapse isOpen={isOpen} navbar>
            <Nav navbar className="d-flex flex-wrap justify-content-center align-items-center gap-2 py-2">
              {categories.map((cat) => (
                <NavItem key={cat}>
                  <button
                    onClick={() => handleCategorySelectLocal(cat)}
                    className={`category-btn px-3 py-1 ${activeCategory === cat ? "active" : ""}`}
                  >
                    {cat}
                  </button>
                </NavItem>
              ))}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
