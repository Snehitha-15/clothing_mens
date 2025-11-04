import React from "react";

export default function SignInScreen({ signInForm, setSignInForm, handleSignIn }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-signin-container">
      <form className="profile-signin-form" onSubmit={handleSignIn}>
        <h2>Sign in or create account</h2>

        <label htmlFor="email" className="bold-label">
          Email or mobile number
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={signInForm.email}
          onChange={handleChange}
          placeholder="Enter email or mobile"
          required
        />

        <button type="submit" className="btn">
          Continue
        </button>

        <p className="info-text">
          By continuing, you agree to our Conditions of Use and Privacy Notice.
        </p>

        <p className="business-text">
          Buying for work?{" "}
          <span className="link-text">Create a free business account</span>
        </p>
      </form>
    </div>
  );
}
