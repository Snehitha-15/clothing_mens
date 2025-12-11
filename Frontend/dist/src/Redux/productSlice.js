import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import api from "../api.json";

/* ===============================
   FETCH ALL PRODUCTS
================================ */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(api.Products.products);
      return res.data || [];
    } catch (err) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

/* ===============================
   FETCH SPECIAL PRODUCTS
================================ */
export const fetchSpecialProducts = createAsyncThunk(
  "products/fetchSpecialProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${api.Products.products}?special=true`);
      return res.data || [];
    } catch (err) {
      return rejectWithValue("Failed to fetch special products");
    }
  }
);

/* ===============================
   FETCH PRODUCT BY ID (PDP)
================================ */
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${api.Products.products}${id}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch product details");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    all: [],
    special: [],
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ALL PRODUCTS */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SPECIAL PRODUCTS */
      .addCase(fetchSpecialProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpecialProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.special = action.payload;
      })
      .addCase(fetchSpecialProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SINGLE PRODUCT (PDP) */
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.single = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
