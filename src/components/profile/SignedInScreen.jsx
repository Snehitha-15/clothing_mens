import React from "react";

export default function SignedInScreen({ user, handleLogout }) {
  return (
    <div className="profile-page container">
      <h2>Welcome!</h2>
      <p>You are signed in as {user.email}</p>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
