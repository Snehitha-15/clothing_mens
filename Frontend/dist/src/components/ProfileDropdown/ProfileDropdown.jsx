// 📌 src/components/Profile/ProfileDropdown.jsx
import React from "react";
import "./ProfileDropdown.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../Redux/authSlice";
import { clearProfile } from "../../Redux/profileSlice";

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearProfile());
  };

  // small helper to safely get fallback name
  const getDisplayName = (u) => {
    if (!u) return "";
    if (u.name) return u.name;
    if (u.email) return u.email.split("@")[0];
    return u.phone_number || `User${u.id || ""}`;
  };

  return (
    <div className="myntra-dropdown">
      {!user ? (
        <>
          <p className="welcome-title">Welcome</p>
          <p className="welcome-sub">To access your account</p>

          <Link to="/login">
            <button className="login-btn">LOGIN / SIGNUP</button>
          </Link>

          <hr />
        </>
      ) : (
        <>
          {/* Show fallback when name is null */}
          <p className="welcome-title">Hello {getDisplayName(user)}</p>

          {/* show phone_number (that's what backend returns) */}
          <p className="welcome-sub">{user.phone_number || user.email}</p>
          <hr />
        </>
      )}

      <ul className="dropdown-list">
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/wishlist">Wishlist</Link></li>
        <li><Link to="/gift-cards">Gift Cards</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>

        <li className="insider-row">
          <span>MENZSTYLE Insider</span>
          <span className="new-badge">NEW</span>
        </li>
      </ul>

      <hr />

      <ul className="dropdown-list">
        <li><Link to="/coupons">Coupons</Link></li>
        <li><Link to="/saved-addresses">Saved Addresses</Link></li>

        {user && (
          <>
            <li><Link to="/edit-profile">Edit Profile</Link></li>
            <li className="logout-row" onClick={handleLogout}>
              Logout
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProfileDropdown;
