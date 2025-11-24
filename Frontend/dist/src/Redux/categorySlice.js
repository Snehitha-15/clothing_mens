// src/Redux/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../api.json";

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 🔹 Fetch category data
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(endpoints.Categories.list);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    tree: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];

        const all = state.list;

        // 🔥 Parent categories (no parent or "-")
        const parents = all.filter(
          (c) => !c.parent || c.parent === "-" || c.parent === null
        );

        // 🔥 Build tree: attach subcategories using parent.name
        const tree = parents.map((parent) => ({
          ...parent,
          children: all.filter((c) => c.parent === parent.name),
        }));

        state.tree = tree;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error loading categories";
      });
  },
});

export default categorySlice.reducer;
