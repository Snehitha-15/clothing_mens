// import { createSlice } from "@reduxjs/toolkit";

// const savedProfile = localStorage.getItem("redux_profile");

// const initialState = savedProfile
//   ? JSON.parse(savedProfile)
//   : {
//       name: "Guest User",
//       email: "",
//       phone: "",
//       address: "",
//       profileImage: null,
//       loggedIn: false,
//     };

// const profileSlice = createSlice({
//   name: "profile",
//   initialState,
//   reducers: {
//     signIn(state, action) {
//       const { name, email, phone, address, profileImage } = action.payload;

//       state.loggedIn = true;
//       state.name = name || "User";
//       state.email = email || "";
//       state.phone = phone || "";
//       state.address = address || "";
//       state.profileImage = profileImage || null;

//       localStorage.setItem("redux_profile", JSON.stringify(state));
//     },

//     updateProfile(state, action) {
//       Object.assign(state, action.payload);
//       // Ensure loggedIn stays true when updating profile
//       state.loggedIn = true;
//       localStorage.setItem("redux_profile", JSON.stringify(state));
//     },

//     logout(state) {
//       localStorage.removeItem("redux_profile");
//       state.name = "Guest User";
//       state.email = "";
//       state.phone = "";
//       state.address = "";
//       state.profileImage = null;
//       state.loggedIn = false;
//     },
//   },
// });

// export const { signIn, updateProfile, logout } = profileSlice.actions;
// export default profileSlice.reducer;
