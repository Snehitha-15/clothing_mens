// src/Redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Simulate sending OTP
export const sendOtp = createAsyncThunk("auth/sendOtp", async (mobile, thunkAPI) => {
  try {
    if (mobile.length !== 10) throw new Error("Enter a valid 10-digit number");
    await new Promise(res => setTimeout(res, 1000));
    return { mobile, otp: "1234" };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// Simulate verifying OTP
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ mobile, otp }, thunkAPI) => {
  try {
    if (otp !== "1234") throw new Error("Invalid OTP");
    await new Promise(res => setTimeout(res, 1000));
    return { mobile };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null, step: "mobile" },
  reducers: {
    logout: state => {
      state.user = null;
      state.step = "mobile";
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendOtp.pending, state => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.step = "otp";
        state.mobile = action.payload.mobile;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, state => { state.loading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { mobile: action.payload.mobile };
        state.step = "loggedin";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
