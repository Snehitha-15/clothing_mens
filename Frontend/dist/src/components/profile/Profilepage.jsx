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
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  // ✅ Load current user from localStorage when app starts
  useEffect(() => {
    const storedCurrentUser = localStorage.getItem("currentUser");
    if (storedCurrentUser) {
      dispatch(signIn(JSON.parse(storedCurrentUser)));
    }
  }, [dispatch]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  // ✅ LOGIN FUNCTION
  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching email and password
    const matchedUser = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (matchedUser) {
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      dispatch(signIn(matchedUser));
      setMessageType("success");
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1200);
    } else {
      setMessageType("error");
      setMessage("Incorrect email or password.");
    }
  };

  // ✅ SIGNUP FUNCTION
  const handleSignUp = (e) => {
    e.preventDefault();

    if (formData.email && formData.password && formData.name) {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if user already exists
      const existingUser = users.find((u) => u.email === formData.email);
      if (existingUser) {
        setMessageType("error");
        setMessage("Email already registered. Please log in instead.");
        return;
      }

      const newUser = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      dispatch(signIn(newUser));

      setMessageType("success");
      setMessage("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/"), 1200);
    } else {
      setMessageType("error");
      setMessage("Please fill all fields to create an account.");
    }
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("currentUser");
    setFormData({ email: "", password: "", name: "" });
    setMessage("");
  };

  // ✅ LOGGED-IN VIEW
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

  // ✅ LOGIN / SIGNUP FORM VIEW
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

          {/* ✅ Inline message */}
          {message && (
            <p
              style={{
                color: messageType === "error" ? "red" : "green",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {message}
            </p>
          )}

          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#007BFF",
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
          {isSignUp ? "Already have an account?" : "New to MENZSTYLE?"}{" "}
          <span
            style={{ color: "#007BFF", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
          >
            {isSignUp ? "Login" : "Create one"}
          </span>
        </p>
      </div>
    </div>
  );
}
