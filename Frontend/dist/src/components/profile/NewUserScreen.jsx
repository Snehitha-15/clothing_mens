import React from "react";

export default function NewUserScreen({ email, setNewUserScreen, handleProceed }) {
  return (
    <div className="new-user-screen">
      <div className="new-user-box">
        <h2>Looks like you are new to MensClothing</h2>
        <p className="user-email">
          {email}{" "}
          <span className="change-link" onClick={() => setNewUserScreen(false)}>
            Change
          </span>
        </p>
        <p>Let's create an account using your mobile number</p>

        <button className="proceed-btn" onClick={handleProceed}>
          Proceed to create an account
        </button>

        <p className="already-text">
          Already a customer?{" "}
          <span className="link-text" onClick={() => setNewUserScreen(false)}>
            Sign in with another email or mobile
          </span>
        </p>
      </div>
    </div>
  );
}
