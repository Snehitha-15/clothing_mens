// import React, { useState } from "react";
// import "./Profilepage.css"; // same CSS file

// export default function CreateAccount() {
//   const [countryCode, setCountryCode] = useState("+91");
//   const [mobile, setMobile] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");

//   const handleVerify = (e) => {
//     e.preventDefault();
//     alert("Verification code sent to your mobile number!");
//   };

//   return (
//     <div className="create-account-screen">
//       <div className="create-account-box">
//         <h2>Create Account</h2>

//         {/* Mobile Number Section */}
//         <label>Mobile number</label>
//         <div className="mobile-row">
//           <select
//             value={countryCode}
//             onChange={(e) => setCountryCode(e.target.value)}
//           >
//             <option value="+91">IN +91</option>
//             <option value="+1">US +1</option>
//             <option value="+44">UK +44</option>
//             <option value="+61">AU +61</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Mobile number"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//           />
//         </div>

//         {/* Name Section */}
//         <label>Your name</label>
//         <input
//           type="text"
//           placeholder="First and last name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         {/* Password Section */}
//         <label>Password (at least 6 characters)</label>
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <p className="password-note">
//           Passwords must be at least 6 characters.
//         </p>

//         {/* Verification Info */}
//         <p className="verify-text">
//           To verify your number, we will send you a text message with a
//           temporary code. Message and data rates may apply.
//         </p>

//         {/* Verify Button */}
//         <button className="proceed-btn" onClick={handleVerify}>
//           Verify mobile number
//         </button>

//         {/* Already Customer Section */}
//         <p className="already-text">
//           Already a customer?{" "}
//           <span className="link-text">Sign in instead</span>
//         </p>

//         {/* Terms Section */}
//         <p className="verify-text">
//           By creating an account or logging in, you agree to
//           <br />
//           <strong>MensClothing’s</strong> Conditions of Use and Privacy Policy.
//         </p>
//       </div>
//     </div>
//   );
// }
