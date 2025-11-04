import React, { useState, useEffect } from "react";
import "./Profilepage.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn, logout } from "../../Redux/profileSlice";

export default function ProfilePage() {
  const user = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Toggle between Login and Sign Up
  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(signIn(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (formData.email && formData.password) {
      const loggedUser = { email: formData.email };
      dispatch(signIn(loggedUser));
      localStorage.setItem("user", JSON.stringify(loggedUser));
      navigate("/");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (formData.email && formData.password && formData.name) {
      const newUser = { email: formData.email, name: formData.name };
      dispatch(signIn(newUser));
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    setFormData({ email: "", password: "", name: "" });
  };

  // 🔹 Logged-in Screen
  if (user.loggedIn) {
    return (
      <div className="profile-page container">
        <h2>Welcome back, {user.name || user.email.split("@")[0]} 👋</h2>
        <p>You are logged in as {user.email}</p>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  // 🔹 Login / Sign Up Page
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignUp ? "Create Account" : "Login to Your Account"}</h2>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp && (
            <>
              <label className="bold-label">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </>
          )}

          <label className="bold-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="bold-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="toggle-text">
          {isSignUp ? "Already have an account?" : "New to MensClothing?"}{" "}
          <span
            className="link-text"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Create one"}
          </span>
        </p>

        <p className="info-text">
          By continuing, you agree to MensClothing’s{" "}
          <span className="link-text">Conditions of Use</span> and{" "}
          <span className="link-text">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
