// 📌 src/Redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";
import endpoints from "../api.json";
import { fetchProfile } from "./profileSlice";

/* =========================================================
   🔐 SIGNUP
========================================================= */
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

/* =========================================================
   🔐 LOGIN
========================================================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ identifier, password }, thunkAPI) => {
    try {
      const response = await API.post(endpoints.auth.login, {
        identifier,
        password,
      });

      const { access, refresh } = response.data;

      // Store Tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Fetch profile after login
      thunkAPI.dispatch(fetchProfile());

      return { user: response.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Invalid credentials"
      );
    }
  }
);

/* =========================================================
   🚪 LOGOUT
========================================================= */
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  localStorage.removeItem("profileUser");
  return true;
});

/* =========================================================
   🔁 SEND OTP (STEP 1)
========================================================= */
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async ({ identifier }, thunkAPI) => {
    try {
      const res = await API.post(endpoints.auth.reset, {
        step: "send_otp",
        identifier,
      });

      return {
        reset_token: res.data.reset_token,
        identifier,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to send OTP"
      );
    }
  }
);

/* =========================================================
   🔍 VERIFY OTP (STEP 2)
========================================================= */
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

/* =========================================================
   🔐 SET NEW PASSWORD (STEP 3)
========================================================= */
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

/* =========================================================
   Load user from localStorage
========================================================= */
const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

/* =========================================================
   AUTH SLICE
========================================================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    loading: false,
    error: null,

    // Reset Password Flow
    resetStep: "idle", // idle | otp | newPassword | done
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
      /* --------------------------------------------------
         SIGNUP
      -------------------------------------------------- */
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

      /* --------------------------------------------------
         LOGIN
      -------------------------------------------------- */
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

      /* --------------------------------------------------
         RESET STEP 1: SEND OTP
      -------------------------------------------------- */
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.reset_token = action.payload.reset_token;
        state.resetIdentifier = action.payload.identifier;
        state.resetStep = "otp"; // Move UI → OTP screen
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --------------------------------------------------
         RESET STEP 2: VERIFY OTP
      -------------------------------------------------- */
      .addCase(verifyResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetOtp.fulfilled, (state) => {
        state.loading = false;
        state.resetStep = "newPassword"; // Move UI → New Password screen
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --------------------------------------------------
         RESET STEP 3: SET NEW PASSWORD
      -------------------------------------------------- */
      .addCase(setNewPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setNewPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetStep = "done"; // Final step
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --------------------------------------------------
         LOGOUT
      -------------------------------------------------- */
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
