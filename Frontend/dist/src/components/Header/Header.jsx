// src/components/Header/Header.jsx

import React, { useState, useEffect } from "react";
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

import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import "./Header.css";

const Header = ({
  categoriesTree = [],
  onSubCategorySelect,
  searchQuery,
  setSearchQuery,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState("Tirupati");
  const [activeParentId, setActiveParentId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const cartItems = useSelector((state) => state.cart.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navigate = useNavigate();

  /* ===================== CLOSE DROPDOWN WHEN CLICKING OUTSIDE ===================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!document.getElementById("profile-area")?.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ===================== SEARCH ===================== */
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  /* ===================== CATEGORY CLICK ===================== */
  const handleSubClick = (sub) => {
    if (onSubCategorySelect) onSubCategorySelect(sub.name);
    setActiveParentId(null);
  };

  return (
    <header className="header-wrapper">

      {/* ===================== TOP BAR ===================== */}
      <Navbar color="dark" dark expand="md" className="amazon-topbar py-2">
        <Container fluid className="px-3">

          <div className="d-flex justify-content-between align-items-center w-100">

            {/* LEFT: LOGO + LOCATION */}
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <h2
                className="brand mb-0"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                MENZ<span className="text-warning">STYLE</span>
              </h2>

              <div
                className="d-flex align-items-center gap-1 location-box"
                onClick={() => {
                  const newLoc = prompt("Enter Location:", location);
                  if (newLoc?.trim()) setLocation(newLoc);
                }}
              >
                <FaMapMarkerAlt />
                <span className="location-text">Deliver to {location}</span>
              </div>
            </div>

            {/* ===================== RIGHT SECTION ===================== */}
            <div className="d-flex align-items-center gap-4 right-section">

              {/* ---------- SEARCH BAR ---------- */}
              <div className="search-bar d-flex align-items-center bg-white rounded-pill px-3">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 flex-grow-1"
                />
                <Button
                  color="warning"
                  className="border-0 rounded-circle"
                  style={{ width: "38px", height: "38px" }}
                  onClick={handleSearch}
                >
                  <FaSearch color="black" />
                </Button>
              </div>

              {/* ---------- PROFILE ICON (CLICK TO OPEN) ---------- */}
              <div
                id="profile-area"
                className="profile-hover-area"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfile(!showProfile);
                }}
              >
                <FaUser size={18} />

                {showProfile && (
                  <div className="myntra-dropdown-wrapper">
                    <ProfileDropdown user={null} />
                  </div>
                )}
              </div>

              {/* ---------- WISHLIST ---------- */}
              <Link to="/wishlist" className="text-white position-relative">
                <FaHeart size={18} />
                {wishlistCount > 0 && (
                  <span className="wishlist-badge">{wishlistCount}</span>
                )}
              </Link>

              {/* ---------- CART ---------- */}
              <Link to="/cart" className="text-white position-relative">
                <FaShoppingCart size={20} />
                {totalQty > 0 && (
                  <span className="cart-badge">{totalQty}</span>
                )}
              </Link>

              {/* ---------- MOBILE TOGGLER ---------- */}
              <NavbarToggler
                onClick={() => setIsOpen(!isOpen)}
                className="border-0 d-md-none"
              >
                <FaBars color="white" />
              </NavbarToggler>
            </div>

          </div>

        </Container>
      </Navbar>

      {/* ===================== CATEGORY BAR ===================== */}
      <Navbar color="light" light expand="md" className="amazon-categorybar shadow-sm py-0">
        <Container fluid className="px-3">

          <Collapse isOpen={isOpen} navbar>
            <Nav navbar className="navbar-nav mx-auto d-flex align-items-center gap-3 py-2">

              {categoriesTree.map((parent) => (
                <NavItem
                  key={parent.id}
                  className="position-relative"
                  onMouseEnter={() => setActiveParentId(parent.id)}
                  onMouseLeave={() => setActiveParentId(null)}
                >
                  <button
                    className={`category-btn ${
                      activeParentId === parent.id ? "active" : ""
                    }`}
                    onClick={() => onSubCategorySelect(parent.name)}
                  >
                    {parent.name}
                  </button>

                  {activeParentId === parent.id &&
                    parent.subcategories?.length > 0 && (
                      <div className="category-dropdown">
                        {parent.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="category-dropdown-item"
                            onClick={() => handleSubClick(sub)}
                          >
                            {sub.name}
                          </div>
                        ))}
                      </div>
                    )}
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
