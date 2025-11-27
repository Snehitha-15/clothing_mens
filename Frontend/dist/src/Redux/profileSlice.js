// 📌 src/Redux/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../api.json";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 🔥 FETCH PROFILE API
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) return thunkAPI.rejectWithValue("No token found");

      const res = await API.get(endpoints.profile.profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load profile");
    }
  }
);

const storedUser = localStorage.getItem("profileUser")
  ? JSON.parse(localStorage.getItem("profileUser"))
  : null;

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: storedUser,
    loading: false,
    error: null,
  },

  reducers: {
    clearProfile: (state) => {
      state.user = null;
      localStorage.removeItem("profileUser");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("profileUser", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
