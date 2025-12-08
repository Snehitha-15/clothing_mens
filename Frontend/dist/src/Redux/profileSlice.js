// 📌 src/Redux/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";
import endpoints from "../api.json";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) return thunkAPI.rejectWithValue("No token found");

      console.log("🔎 Calling PROFILE API:", endpoints.profile.profile);

      const res = await API.get(endpoints.profile.profile); // No headers needed

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
  initialState: { user: storedUser, loading: false, error: null },
  reducers: {
    clearProfile: (state) => {
      state.user = null;
      localStorage.removeItem("profileUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("profileUser", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
