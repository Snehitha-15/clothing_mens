import React from "react";
import "./ProfileDropdown.css";
import { Link } from "react-router-dom";

const ProfileDropdown = ({ user, onLogout }) => {
  const isLoggedIn = !!user;

  return (
    <div className="myntra-dropdown">

      {/* TOP SECTION */}
      <div className="dropdown-top">
        <p className="welcome-text">Welcome</p>
        <p className="sub-text">To access account and manage orders</p>

        {!isLoggedIn ? (
          <Link to="/login">
            <button className="login-btn">LOGIN / SIGNUP</button>
          </Link>
        ) : (
          <p className="user-greet">Hi, {user?.name || "User"}</p>
        )}
      </div>

      <hr className="divider" />

      {/* FIRST MENU */}
      <ul className="dropdown-list">
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/wishlist">Wishlist</Link></li>
        <li><Link to="/gift-cards">Gift Cards</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>

        <li className="insider-item">
          <span>MENZSTYLE Insider</span>
          <span className="new-badge">NEW</span>
        </li>
      </ul>

      <hr className="divider" />

      {/* SECOND MENU */}
      <ul className="dropdown-list">
        <li><Link to="/store-credit">Store Credit</Link></li>
        <li><Link to="/coupons">Coupons</Link></li>
        <li><Link to="/saved-cards">Saved Cards</Link></li>
        <li><Link to="/saved-vpa">Saved VPA</Link></li>
        <li><Link to="/saved-addresses">Saved Addresses</Link></li>

        {isLoggedIn && (
          <li className="logout-btn" onClick={onLogout}>Logout</li>
        )}
      </ul>

    </div>
  );
};

export default ProfileDropdown;
