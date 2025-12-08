import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import api from "../api.json";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(api.Products.products);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

// Fetch special products
export const fetchSpecialProducts = createAsyncThunk(
  "products/fetchSpecialProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${api.Products.products}?special=true`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch special products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    all: [],
    special: [],
    one: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // all products
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
      })

      // special products
      .addCase(fetchSpecialProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpecialProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.special = action.payload || [];
      })
      .addCase(fetchSpecialProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
