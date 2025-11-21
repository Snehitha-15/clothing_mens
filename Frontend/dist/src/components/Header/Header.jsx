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

const Header = ({
  categoriesTree = [],
  onSubCategorySelect,
  searchQuery,
  setSearchQuery,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [location, setLocation] = React.useState("Tirupati");
  const [activeParentId, setActiveParentId] = React.useState(null);

  const cartItems = useSelector((state) => state.cart.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  const handleLocationClick = () => {
    const newLoc = prompt("Enter your delivery location:", location);
    if (newLoc && newLoc.trim() !== "") setLocation(newLoc);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleSubClick = (sub) => {
    if (onSubCategorySelect) {
      onSubCategorySelect(sub.name);
    }
    setActiveParentId(null);
  };
console.log("CategoriesTree in Header:", categoriesTree);
  return (
    <header className="header-wrapper">
      {/* ===================== TOP BAR ===================== */}
      <Navbar color="dark" dark expand="md" className="amazon-topbar py-2">
        <Container fluid className="px-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap w-100">
            {/* LEFT - LOGO + LOCATION */}
            <div className="d-flex align-items-center flex-shrink-0 gap-2">
              <div onClick={handleLogoClick} className="logo" style={{ cursor: "pointer" }}>
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

            {/* RIGHT SECTION */}
            <div className="d-flex align-items-center gap-3 ms-auto right-section">
              {/* SEARCH BAR */}
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

              {/* PROFILE */}
              <Link to="/profile" className="text-white text-decoration-none">
                <FaUser size={18} />
              </Link>

              {/* WISHLIST */}
              <Link to="/wishlist" className="text-white position-relative">
                <FaHeart size={18} />
                {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
              </Link>
              {/* CART */}
             <Link
              to="/cart"
              className="text-white text-decoration-none position-relative d-flex align-items-center"
              style={{ fontSize: "18px" }}
            >
             <FaShoppingCart size={20} />
              {totalQty > 0 && (
             <span
              className="cart-badge"
              style={{
              position: "absolute",
              top: "-4px",
              right: "-10px",
              background: "#ffc107",
              color: "#000",
              fontSize: "11px",
              fontWeight: "600",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
           >
            {totalQty}
           </span>
            )}
         </Link>
              {/* MOBILE TOGGLER */}
              <NavbarToggler onClick={() => setIsOpen(!isOpen)} className="border-0 d-md-none">
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
            <Nav navbar className="d-flex flex-wrap justify-content-center align-items-center gap-2 py-2">
              {categoriesTree.map((parent) => (
  <NavItem
    key={parent.id}
    className="position-relative"
    onMouseEnter={() => setActiveParentId(parent.id)}
    onMouseLeave={() => setActiveParentId(null)}
  >
    <button
      className={`category-btn px-3 py-1 ${activeParentId === parent.id ? "active" : ""}`}
      onClick={() => onSubCategorySelect(parent.name)}
    >
      {parent.name}
    </button>

    {/* 🔥 Use subcategories instead of children */}
    {parent.subcategories?.length > 0 && activeParentId === parent.id && (
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
