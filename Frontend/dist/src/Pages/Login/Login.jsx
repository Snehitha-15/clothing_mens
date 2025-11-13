// src/Pages/Login/Login.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../../Redux/authSlice";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const { step, loading, error, user } = useSelector(state => state.auth);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = e => {
    e.preventDefault();
    dispatch(sendOtp(mobile));
  };

  const handleVerifyOtp = e => {
    e.preventDefault();
    dispatch(verifyOtp({ mobile, otp }));
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1 className="brand-name">Brand</h1>
        <p className="tagline">Your fashion destination</p>
      </div>
      <div className="login-right">
        {!user ? (
          <form className="login-form" onSubmit={step === "otp" ? handleVerifyOtp : handleSendOtp}>
            {step === "mobile" && (
              <>
                <h2>Login</h2>
                <input
                  type="tel"
                  placeholder="Enter mobile"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                />
                <button type="submit">{loading ? "Sending..." : "Send OTP"}</button>
              </>
            )}
            {step === "otp" && (
              <>
                <h2>Verify OTP</h2>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
                <button type="submit">{loading ? "Verifying..." : "Verify OTP"}</button>
              </>
            )}
            {error && <p className="error">{error}</p>}
          </form>
        ) : (
          <div className="welcome">
            Welcome {user.mobile}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
