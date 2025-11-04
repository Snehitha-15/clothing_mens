import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn, logout } from "../../Redux/profileSlice";

export default function ProfilePage() {
  const user = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

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

  if (user.loggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Welcome back, {user.name || user.email.split("@")[0]} 👋</h2>
        <p>You are logged in as {user.email}</p>
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2>{isSignUp ? "Create Account" : "Login to Your Account"}</h2>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp && (
            <>
              <label style={{ fontWeight: "bold" }}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </>
          )}

          <label style={{ fontWeight: "bold" }}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: "bold" }}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          {/* 🔹 Centered Blue Button */}
          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#007BFF", // Blue color
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "50%",
              }}
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>

        <p style={{ marginTop: "15px" }}>
          {isSignUp ? "Already have an account?" : "New to MensClothing?"}{" "}
          <span
            style={{ color: "#007BFF", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Create one"}
          </span>
        </p>
      </div>
    </div>
  );
}
