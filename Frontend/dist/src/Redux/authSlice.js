// 📌 src/Redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosIntance";
import endpoints from "../api.json";

/* 🔐 SIGNUP (multi-step backend – you already handle userData) */
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, thunkAPI) => {
    try {
      const res = await API.post(endpoints.auth.signup, userData);
      return { user: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Signup failed"
      );
    }
  }
);

/* 🔐 LOGIN */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ identifier, password }, thunkAPI) => {
    try {
      console.log("📤 Sending Login:", { identifier, password });

      // 🔹 Backend expects: { identifier, password }
      const response = await API.post(endpoints.auth.login, {
        identifier,
        password,
      });

      console.log("🎯 Login Response:", response.data);

      const { access, refresh } = response.data;

      // 🔹 Save tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // 🔹 Fetch profile (ProfileView)
      const profileResponse = await API.get("/api/profile/");
      const user = profileResponse.data;

      localStorage.setItem("user", JSON.stringify(user));

      return { user };
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);

      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Invalid credentials"
      );
    }
  }
);

/* 🔁 REQUEST OTP (ResetPasswordView → step = send_otp) */
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async ({ identifier }, thunkAPI) => {
    try {
      const res = await API.post(endpoints.auth.reset, {
        step: "send_otp",
        identifier,
      });

      // backend returns: { message, reset_token }
      return { reset_token: res.data.reset_token, identifier };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to send OTP"
      );
    }
  }
);

/* 🔍 VERIFY OTP (ResetPasswordView → step = verify_otp) */
export const verifyResetOtp = createAsyncThunk(
  "auth/verifyResetOtp",
  async ({ reset_token, otp }, thunkAPI) => {
    try {
      await API.post(endpoints.auth.reset, {
        step: "verify_otp",
        reset_token,
        otp,
      });
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Invalid OTP"
      );
    }
  }
);

/* 🔐 SET NEW PASSWORD (ResetPasswordView → step = reset_password) */
export const setNewPassword = createAsyncThunk(
  "auth/setNewPassword",
  async ({ reset_token, password, password2 }, thunkAPI) => {
    try {
      await API.post(endpoints.auth.reset, {
        step: "reset_password",
        reset_token,
        password,
        password2,
      });
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Password reset failed"
      );
    }
  }
);

/* 🚪 LOGOUT */
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  return true;
});

/* 🔹 Initial State from localStorage */
const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    loading: false,
    error: null,
    resetStep: "idle", // 'idle' | 'otp' | 'newPassword' | 'done'
    reset_token: null,
    resetIdentifier: "",
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* 🔐 SIGNUP */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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

      /* 🔁 REQUEST OTP */
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.reset_token = action.payload.reset_token;
        state.resetIdentifier = action.payload.identifier;
        state.resetStep = "otp";
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🔍 VERIFY OTP */
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
        state.reset_token = null;
        state.resetIdentifier = "";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
