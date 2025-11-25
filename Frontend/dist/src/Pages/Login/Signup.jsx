// 📌 src/pages/Auth/Signup.jsx
import React, { useEffect, useState } from "react";
import "./Login.css"; // reuse same layout + left image
import { useSelector, useDispatch } from "react-redux";
import { clearAuthError } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import endpoints from "../../api.json";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  // Steps: email -> emailOtp -> phone -> phoneOtp -> password
  const [step, setStep] = useState("email");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔹 VERY IMPORTANT: store signup_token from backend
  const [signupToken, setSignupToken] = useState("");

  // For showing simple success messages
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        dispatch(clearAuthError());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, dispatch]);

  /* 🔹 Step 1: Send Email OTP */
  const handleSendEmailOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await API.post(endpoints.auth.signup, {
        step: "email",          // ✅ backend expects "email"
        email: email,
      });

      // expect: { message: "...", signup_token: "..." }
      if (res.data?.signup_token) {
        setSignupToken(res.data.signup_token);
      }

      setInfoMessage("OTP sent to your email");
      setStep("emailOtp");
    } catch (err) {
      console.error(err);
      setInfoMessage("");
      alert(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data || "Email step failed")
      );
    }
  };

  /* 🔹 Step 2: Verify Email OTP */
  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    if (!emailOtp || !signupToken) {
      alert("Missing OTP or signup token");
      return;
    }

    try {
      await API.post(endpoints.auth.signup, {
        step: "email_verification",   // ✅ backend expects this
        signup_token: signupToken,
        email_otp: emailOtp,
      });

      setInfoMessage("Email verified successfully");
      setStep("phone");
    } catch (err) {
      console.error(err);
      setInfoMessage("");
      alert(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data || "Email verification failed")
      );
    }
  };

  /* 🔹 Step 3: Send Phone OTP */
  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();
    if (!phone || !signupToken) {
      alert("Missing phone number or signup token");
      return;
    }

    try {
      await API.post(endpoints.auth.signup, {
        step: "phone_number",       // ✅ backend expects this
        signup_token: signupToken,
        phone_number: phone,
      });

      setInfoMessage("OTP sent to your phone");
      setStep("phoneOtp");
    } catch (err) {
      console.error(err);
      setInfoMessage("");
      alert(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data || "Phone step failed")
      );
    }
  };

  /* 🔹 Step 4: Verify Phone OTP */
  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    if (!phoneOtp || !signupToken) {
      alert("Missing phone OTP or signup token");
      return;
    }

    try {
      await API.post(endpoints.auth.signup, {
        step: "phone_verification",   // ✅ backend expects this
        signup_token: signupToken,
        phone_otp: phoneOtp,
      });

      setInfoMessage("Phone number verified");
      setStep("password");
    } catch (err) {
      console.error(err);
      setInfoMessage("");
      alert(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data || "Phone verification failed")
      );
    }
  };

  /* 🔹 Step 5: Set Password + Final Submit */
  const handleFinalSignup = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword || !signupToken || !username) {
      alert("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post(endpoints.auth.signup, {
        step: "password",       // ✅ final backend step
        signup_token: signupToken,
        username: username,
        password: password,
        password2: confirmPassword,
      });

      alert("Account created successfully! Please login.");
      // you are not auto-logged in, so go to login
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data || "Account creation failed")
      );
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT IMAGE SAME AS LOGIN */}
      <div className="login-left">
        {/* keep your existing image background via CSS */}
      </div>

      {/* RIGHT SIDE - SIGNUP STEPS */}
      <div className="login-right">
        <div className="login-form">
          <h2 align="center">Create Account</h2>

          {infoMessage && <p className="info">{infoMessage}</p>}
          {error && <p className="error">{error}</p>}

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <form onSubmit={handleSendEmailOtp}>
              <input
                type="text"
                placeholder="Username"
                className="mb-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Send Email OTP"}
              </button>

              <button
                type="button"
                className="link-button mt-1"
                onClick={() => navigate("/login")}
              >
                Back to login
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY EMAIL OTP */}
          {step === "emailOtp" && (
            <form onSubmit={handleVerifyEmailOtp}>
              <p className="helper-text">
                We&apos;ve sent an OTP to {email}. Please enter it below.
              </p>
              <input
                type="text"
                placeholder="Email OTP"
                className="mb-2"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <button
                type="button"
                className="link-button mt-1"
                onClick={() => setStep("email")}
              >
                Back
              </button>
            </form>
          )}

          {/* STEP 3: PHONE NUMBER */}
          {step === "phone" && (
            <form onSubmit={handleSendPhoneOtp}>
              <input
                type="tel"
                placeholder="Phone Number"
                className="mb-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Send Phone OTP"}
              </button>

              <button
                type="button"
                className="link-button mt-1"
                onClick={() => setStep("emailOtp")}
              >
                Back
              </button>
            </form>
          )}

          {/* STEP 4: VERIFY PHONE OTP */}
          {step === "phoneOtp" && (
            <form onSubmit={handleVerifyPhoneOtp}>
              <p className="helper-text">
                We&apos;ve sent an OTP to {phone}. Please enter it below.
              </p>
              <input
                type="text"
                placeholder="Phone OTP"
                className="mb-2"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Phone"}
              </button>

              <button
                type="button"
                className="link-button mt-1"
                onClick={() => setStep("phone")}
              >
                Back
              </button>
            </form>
          )}

          {/* STEP 5: SET PASSWORD */}
          {step === "password" && (
            <form onSubmit={handleFinalSignup}>
              <input
                type="password"
                placeholder="Password"
                className="mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="mb-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <button
                type="button"
                className="link-button mt-1"
                onClick={() => setStep("phoneOtp")}
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
