import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { isLoggedIn: false, name: "" },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.name = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.name = "";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer; // ✅ must be default
