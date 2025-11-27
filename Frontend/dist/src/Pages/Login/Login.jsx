// 📌 src/Pages/Login/Login.jsx
import React, { useEffect, useState } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  requestPasswordReset,
  verifyResetOtp,
  setNewPassword,
  clearAuthError,
} from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, resetStep, reset_token, resetIdentifier } =
    useSelector((state) => state.auth);

  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Forgot Password UI state
  const [forgotScreen, setForgotScreen] = useState("none"); // 'none' | 'identifier' | 'otp' | 'newPassword'
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPasswordInput] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // 🔹 Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // 🔹 Auto clear error after 3s
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => dispatch(clearAuthError()), 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, dispatch]);

  // 🔹 Sync UI with resetStep
  useEffect(() => {
    if (resetStep === "otp") {
      setForgotScreen("otp");
    } else if (resetStep === "newPassword") {
      setForgotScreen("newPassword");
    } else if (resetStep === "done") {
      alert("Password reset successful! Please login.");
      setForgotScreen("none");
      setForgotIdentifier("");
      setForgotOtp("");
      setNewPasswordInput("");
      setConfirmNewPassword("");
    }
  }, [resetStep]);

  /* 🔐 LOGIN SUBMIT */
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ identifier, password }));
  };

  /* 🔁 SEND OTP */
  const handleSendResetOtp = (e) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    dispatch(requestPasswordReset({ identifier: forgotIdentifier }));
  };

  /* 🔍 VERIFY OTP */
  const handleVerifyResetOtp = (e) => {
    e.preventDefault();
    if (!reset_token) {
      alert("Reset token missing. Please request OTP again.");
      return;
    }
    dispatch(verifyResetOtp({ reset_token, otp: forgotOtp }));
  };

  /* 🔐 SET NEW PASSWORD */
  const handleSetNewPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!reset_token) {
      alert("Reset token missing. Please start reset process again.");
      return;
    }
    dispatch(
      setNewPassword({
        reset_token,
        password: newPassword,
        password2: confirmNewPassword,
      })
    );
  };

  // While logged in, don't show login form
  if (user) return null;

  return (
    <div className="login-wrapper">
      <div className="login-left"></div>

      <div className="login-right">
        {/* LOGIN NORMAL SCREEN */}
        {forgotScreen === "none" && (
          <form onSubmit={handleLogin} className="login-form">
            <h2 align="center">Login</h2>

            <input
              type="text"
              placeholder="Email / Phone / Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mb-2"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p className="error">{error}</p>}

            <div className="login-links">
              <button
                type="button"
                className="link-button"
                onClick={() => setForgotScreen("identifier")}
              >
                Forgot password?
              </button>
              <button
                type="button"
                className="link-button"
                onClick={() => navigate("/signup")}
              >
                Create account
              </button>
            </div>
          </form>
        )}

        {/* FORGOT STEP 1: ENTER IDENTIFIER */}
        {forgotScreen === "identifier" && (
          <form onSubmit={handleSendResetOtp} className="login-form">
            <h2 align="center">Reset Password</h2>

            <input
              type="text"
              placeholder="Email or Phone Number"
              value={forgotIdentifier}
              onChange={(e) => setForgotIdentifier(e.target.value)}
              className="mb-2"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {error && <p className="error">{error}</p>}

            <button
              type="button"
              className="link-button mt-1"
              onClick={() => setForgotScreen("none")}
            >
              Back to login
            </button>
          </form>
        )}

        {/* FORGOT STEP 2: ENTER OTP */}
        {forgotScreen === "otp" && (
          <form onSubmit={handleVerifyResetOtp} className="login-form">
            <h2 align="center">Verify OTP</h2>

            <input
              type="text"
              placeholder="Enter OTP"
              value={forgotOtp}
              onChange={(e) => setForgotOtp(e.target.value)}
              className="mb-2"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {error && <p className="error">{error}</p>}
          </form>
        )}

        {/* FORGOT STEP 3: NEW PASSWORD */}
        {forgotScreen === "newPassword" && (
          <form onSubmit={handleSetNewPassword} className="login-form">
            <h2 align="center">Set New Password</h2>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              className="mb-2"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mb-2"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Password"}
            </button>

            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
