import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Input,
  Button,
  Collapse,
  NavbarToggler,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import "./Header.css";

const Header = ({ categories = [], onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cartItems = useSelector((state) => state.cart.items || []);
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Navbar expand="md" className="header-nav px-4 py-2 shadow-sm" color="light">
      {/* Logo */}
       <div>
              <Link to="/" style={{ textDecoration: "none" }}>
                <h2 style={{ fontWeight: "bold", fontSize: "22px", color: "#000" }}>
                  MENZ<span style={{ color: "#dc3545" }}>STYLE</span>
                </h2>
              </Link>
              
            </div>

      {/* Mobile Toggler */}
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />

      <Collapse isOpen={isOpen} navbar>
        {/* 🧭 Categories in center */}
        <Nav className="mx-auto align-items-center" navbar>
          {categories.map((cat) => (
            <NavItem key={cat}>
              <button
                onClick={() => onCategorySelect(cat)}
                className="btn btn-link text-dark text-decoration-none mx-2"
                style={{
                  fontWeight: "500",
                  borderBottom: "2px solid transparent",
                }}
                onMouseEnter={(e) => (e.target.style.borderBottom = "2px solid black")}
                onMouseLeave={(e) => (e.target.style.borderBottom = "2px solid transparent")}
              >
                {cat}
              </button>
            </NavItem>
          ))}
        </Nav>

        {/* 🔍 Search + Profile + Cart */}
        <div className="d-flex align-items-center gap-3">
          {/* Search */}
          <div className="d-flex align-items-center border rounded-pill px-2">
            <Input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0"
              style={{ width: "150px" }}
            />
            <Button
              color="light"
              className="border-0"
              onClick={() => alert(`Searching for: ${search}`)}
            >
              <FaSearch />
            </Button>
          </div>

          {/* Profile */}
          <Link to="/profile" className="text-dark text-decoration-none d-flex align-items-center">
            <FaUser size={18} />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="text-dark text-decoration-none position-relative">
            <FaShoppingCart size={18} />
            {totalQty > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px" }}
              >
                {totalQty}
              </span>
            )}
          </Link>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default Header;
  