import React from "react";

export default function CreateAccountScreen({
  accountForm,
  setAccountForm,
  handleCreateAccount,
  setCreateAccountScreen,
  setNewUserScreen,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="create-account-screen">
      <div className="create-account-box">
        <h2>Create Account</h2>

        <form onSubmit={handleCreateAccount}>
          <label>Mobile number</label>
          <div className="mobile-row">
            <select
              name="countryCode"
              value={accountForm.countryCode}
              onChange={handleChange}
            >
              <option value="+91">IN +91</option>
              <option value="+1">US +1</option>
              <option value="+44">UK +44</option>
            </select>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile number"
              value={accountForm.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <label>Your name</label>
          <input
            type="text"
            name="name"
            placeholder="First and last name"
            value={accountForm.name}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={accountForm.password}
            onChange={handleChange}
            required
          />

          <p className="password-note">Passwords must be at least 6 characters.</p>

          <p className="verify-text">
            To verify your number, we will send you a text message with a
            temporary code. Message and data rates may apply.
          </p>

          <button type="submit" className="proceed-btn">
            Verify mobile number
          </button>
        </form>

        <p className="already-text">
          Already a customer?{" "}
          <span
            className="link-text"
            onClick={() => {
              setCreateAccountScreen(false);
              setNewUserScreen(false);
            }}
          >
            Sign in instead
          </span>
        </p>

        <p className="info-text">
          By creating an account or logging in, you agree to MensClothing’s{" "}
          <span className="link-text">Conditions of Use</span> and{" "}
          <span className="link-text">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
