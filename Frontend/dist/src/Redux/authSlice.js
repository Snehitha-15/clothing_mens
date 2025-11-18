// 📌 src/Redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../api.json";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

/* 🔹 SEND OTP */
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (mobile, thunkAPI) => {
    try {
      const response = await API.post(endpoints.auth.sendOtp, {
        phone_number: mobile, // 🔥 FIXED KEY
      });
      return { mobile };
    } catch (err) {
      return thunkAPI.rejectWithValue("OTP failed to send");
    }
  }
);

/* 🔹 VERIFY OTP / LOGIN */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ mobile, otp }, thunkAPI) => {
    try {
      const response = await API.post(endpoints.auth.login, {
        phone_number: mobile,
        otp,
      });

      // 🚀 Backend does NOT return user object, so we manually create one
      return { 
        user: { phone_number: mobile }   // this is enough for login
      };
    } catch (err) {
      return thunkAPI.rejectWithValue("Invalid OTP");
    }
  }
);

/* 🔹 LOGOUT */
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await API.post(endpoints.auth.logout);
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,         
    mobile: "",
    loading: false,
    error: null,
    step: "mobile",      
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* 📩 SEND OTP */
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.step = "otp"; // 🔥 Switch to OTP
        state.mobile = action.payload.mobile;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🔓 VERIFY OTP */
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.step = "loggedin"; // 🔥 Set login success
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🚪 LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.step = "mobile";
        state.mobile = "";
      });
  },
});

export default authSlice.reducer;
