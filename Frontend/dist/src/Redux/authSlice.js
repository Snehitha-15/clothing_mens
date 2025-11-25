// 📌 src/Redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../api.json";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

/* 🔹 LOGIN */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ identifier, password }, thunkAPI) => {
    try {
      const response = await API.post(endpoints.auth.login, {
        identifier,
        password,
      });
      return { user: response.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.detail || "Invalid credentials"
      );
    }
  }
);

/* 🔹 🔥 FIXED: SEND OTP for Password Reset */
/* 🔹 SEND OTP for Forgot Password */
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async ({ identifier }, thunkAPI) => {
    try {
      const payload = identifier.includes("@")
        ? { step: "email", email: identifier }
        : { step: "phone_number", phone_number: identifier };

      const response = await API.post(endpoints.auth.reset, payload);

      // backend returns signup_token (important!)
      return { signup_token: response.data.signup_token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

/* 🔹 VERIFY RESET OTP */
export const verifyResetOtp = createAsyncThunk(
  "auth/verifyResetOtp",
  async ({ signup_token, identifier, otp }, thunkAPI) => {
    try {
      const payload = identifier.includes("@")
        ? {
            step: "email_verification",
            signup_token,
            email_otp: otp,
          }
        : {
            step: "phone_verification",
            signup_token,
            phone_otp: otp,
          };

      await API.post(endpoints.auth.reset, payload);
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Invalid OTP"
      );
    }
  }
);

/* 🔹 SET NEW PASSWORD */
export const setNewPassword = createAsyncThunk(
  "auth/setNewPassword",
  async ({ signup_token, new_password, confirm_password }, thunkAPI) => {
    try {
      await API.post(endpoints.auth.reset, {
        step: "password",
        signup_token,
        password: new_password,
        password2: confirm_password,
      });
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

/* 🔹 SIGNUP */
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, thunkAPI) => {
    try {
      const response = await API.post(endpoints.auth.signup, userData);
      return { user: response.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.detail || "Signup failed"
      );
    }
  }
);

/* 🔹 LOGOUT */
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await API.post(endpoints.auth.logout);
  } catch (err) {}
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,

    resetStep: "idle",
    resetIdentifier: "",
  },

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* 🔐 LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🔁 REQUEST RESET OTP */
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.resetIdentifier = action.payload.identifier;
        state.resetStep = "otp";
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🔐 VERIFY OTP */
      .addCase(verifyResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetOtp.fulfilled, (state) => {
        state.loading = false;
        state.resetStep = "newPassword";
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🔐 SET NEW PASSWORD */
      .addCase(setNewPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setNewPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetStep = "done";
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🚪 LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.resetStep = "idle";
        state.resetIdentifier = "";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
