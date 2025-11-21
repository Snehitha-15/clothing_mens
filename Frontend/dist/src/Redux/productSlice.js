// src/Redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../api.json";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(endpoints.Products.products);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    all: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
