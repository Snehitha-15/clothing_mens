// 📌 src/components/Profile/ProfileDropdown.jsx
import React, { useEffect } from "react";
import "./ProfileDropdown.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../Redux/authSlice";
import { fetchProfile, clearProfile } from "../../Redux/profileSlice";
import { fetchWishlist, clearWishlist } from "../../Redux/wishlistSlice";

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  // 🔍 Debug Mount Status
  useEffect(() => {
    console.log("📌 ProfileDropdown Mounted!");
  }, []);

  // 🔥 Fetch profile (only after login)
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token && !user) {
      console.log("🚀 Dispatching fetchProfile()");
      dispatch(fetchProfile());
    }
  }, [dispatch, user]); // user dependency ensures retry only if null

  // 🛍 Fetch Wishlist once user data is available
  useEffect(() => {
    if (user && wishlistCount === 0) {
      console.log("🛒 Dispatching fetchWishlist()");
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      dispatch(clearProfile());
      dispatch(clearWishlist());
      window.location.href = "/login";
    });
  };

  const getDisplayName = (u) => {
    if (!u) return "";
    return u.name || u.email?.split("@")[0] || u.phone_number || "User";
  };

  return (
    <div className="myntra-dropdown">
      {!user ? (
        <>
          <p className="welcome-title">Welcome</p>
          <Link to="/login">
            <button className="login-btn">LOGIN / SIGNUP</button>
          </Link>
        </>
      ) : (
        <>
          <p className="welcome-title">Hello {getDisplayName(user)}</p>
          <p className="welcome-sub">{user.email || user.phone_number}</p>
        </>
      )}
      <hr />

      <ul className="dropdown-list">
        <li><Link to="/orders">My Orders</Link></li>
        <li><Link to="/wishlist">Wishlist ({wishlistCount})</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>

      <hr />

      <ul className="dropdown-list">
        {user && (
          <>
            <li><Link to="/edit-profile">Edit Profile</Link></li>
            <li className="logout-row" onClick={handleLogout}>Logout</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProfileDropdown;
