import React, { useEffect, useState } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { step, loading, error, user, mobile } = useSelector((state) => state.auth);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // 🚀 Redirect to HomePage after successful login
useEffect(() => {
  if (user) navigate("/");
}, [user, navigate]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    dispatch(sendOtp(phone));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ mobile: phone || mobile, otp }));
  };

  // 👍 Prevent showing login if already logged in
  if (user) return null;

  return (
    <div className="login-wrapper">
      <div className="login-left">
      </div>

      <div className="login-right">
        {step === "mobile" && (
          <form onSubmit={handleSendOtp} className="login-form">
            <h2>Login</h2>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button type="submit">{loading ? "Sending..." : "Send OTP"}</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <h2>Verify OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">{loading ? "Verifying..." : "Verify OTP"}</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
