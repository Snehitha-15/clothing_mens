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













// import React, { useState } from "react";
// import "./Profilepage.css";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
// import { signIn, logout } from "../../Redux/profileSlice";

// export default function Profilepage() {
//   const user = useSelector((state) => state.profile);
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); // ✅ Step 1: Initialize navigate

//   const [signInForm, setSignInForm] = useState({ email: "" });
//   const [newUserScreen, setNewUserScreen] = useState(false);
//   const [createAccountScreen, setCreateAccountScreen] = useState(false);

//   const [accountForm, setAccountForm] = useState({
//     countryCode: "+91",
//     mobile: "",
//     name: "",
//     password: "",
//   });

//   // -----------------------------
//   // Handle input changes
//   // -----------------------------
//   const handleSignInChange = (e) => {
//     const { name, value } = e.target;
//     setSignInForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAccountChange = (e) => {
//     const { name, value } = e.target;
//     setAccountForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // -----------------------------
//   // Step 1: Initial sign-in screen
//   // -----------------------------
//   const handleSignIn = (e) => {
//     e.preventDefault();
//     setNewUserScreen(true);
//   };

//   // -----------------------------
//   // Step 2: New user screen
//   // -----------------------------
//   const handleProceed = () => {
//     setCreateAccountScreen(true);
//   };

//   // -----------------------------
//   // Step 3: Create Account
//   // -----------------------------
//   const handleCreateAccount = (e) => {
//     e.preventDefault();

//     // Dispatch signIn to Redux store (you can modify this later to save full user details)
//     dispatch(signIn({ email: signInForm.email }));

//     // ✅ Navigate to home page after verifying mobile number
//     navigate("/");
//   };

//   // -----------------------------
//   // Logout
//   // -----------------------------
//   const handleLogout = () => {
//     dispatch(logout());
//     setSignInForm({ email: "" });
//     setNewUserScreen(false);
//     setCreateAccountScreen(false);
//   };

//   // -----------------------------
//   // UI Rendering
//   // -----------------------------

//   // Step 1: Default Sign-in screen
//   if (!user.loggedIn && !newUserScreen && !createAccountScreen) {
//     return (
//       <div className="profile-signin-container">
//         <form className="profile-signin-form" onSubmit={handleSignIn}>
//           <h2>Sign in or create account</h2>

//           <label htmlFor="email" className="bold-label">
//             Email or mobile number
//           </label>
//           <input
//             type="text"
//             id="email"
//             name="email"
//             value={signInForm.email}
//             onChange={handleSignInChange}
//             placeholder="Enter email or mobile"
//             required
//           />

//           <button type="submit" className="btn">
//             Continue
//           </button>

//           <p className="info-text">
//             By continuing, you agree to our Conditions of Use and Privacy
//             Notice.
//           </p>

//           <p className="business-text">
//             Buying for work?{" "}
//             <span className="link-text">Create a free business account</span>
//           </p>
//         </form>
//       </div>
//     );
//   }

//   // Step 2: Looks like new user screen
//   if (!user.loggedIn && newUserScreen && !createAccountScreen) {
//     return (
//       <div className="new-user-screen">
//         <div className="new-user-box">
//           <h2>Looks like you are new to MensClothing</h2>
//           <p className="user-email">
//             {signInForm.email}{" "}
//             <span
//               className="change-link"
//               onClick={() => setNewUserScreen(false)}
//             >
//               Change
//             </span>
//           </p>
//           <p>Let's create an account using your mobile number</p>

//           <button className="proceed-btn" onClick={handleProceed}>
//             Proceed to create an account
//           </button>

//           <p className="already-text">
//             Already a customer?{" "}
//             <span className="link-text" onClick={() => setNewUserScreen(false)}>
//               Sign in with another email or mobile
//             </span>
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Step 3: Create Account screen
//   if (!user.loggedIn && createAccountScreen) {
//     return (
//       <div className="create-account-screen">
//         <div className="create-account-box">
//           <h2>Create Account</h2>

//           <form onSubmit={handleCreateAccount}>
//             <label>Mobile number</label>
//             <div className="mobile-row">
//               <select
//                 name="countryCode"
//                 value={accountForm.countryCode}
//                 onChange={handleAccountChange}
//               >
//                 <option value="+91">IN +91</option>
//                 <option value="+1">US +1</option>
//                 <option value="+44">UK +44</option>
//               </select>
//               <input
//                 type="text"
//                 name="mobile"
//                 placeholder="Mobile number"
//                 value={accountForm.mobile}
//                 onChange={handleAccountChange}
//                 required
//               />
//             </div>

//             <label>Your name</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="First and last name"
//               value={accountForm.name}
//               onChange={handleAccountChange}
//               required
//             />

//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="At least 6 characters"
//               value={accountForm.password}
//               onChange={handleAccountChange}
//               required
//             />

//             <p className="password-note">
//               Passwords must be at least 6 characters.
//             </p>

//             <p className="verify-text">
//               To verify your number, we will send you a text message with a
//               temporary code. Message and data rates may apply.
//             </p>

//             <button type="submit" className="proceed-btn">
//               Verify mobile number
//             </button>
//           </form>

//           <p className="already-text">
//             Already a customer?{" "}
//             <span
//               className="link-text"
//               onClick={() => {
//                 setCreateAccountScreen(false);
//                 setNewUserScreen(false);
//               }}
//             >
//               Sign in instead
//             </span>
//           </p>

//           <p className="info-text">
//             By creating an account or logging in, you agree to MensClothing’s{" "}
//             <span className="link-text">Conditions of Use</span> and{" "}
//             <span className="link-text">Privacy Policy</span>.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Step 4: Signed-in screen
//   return (
//     <div className="profile-page container">
//       <h2>Welcome!</h2>
//       <p>You are signed in as {user.email}</p>
//       <button className="btn btn-danger" onClick={handleLogout}>
//         Logout
//       </button>
//     </div>
//   );
// }
