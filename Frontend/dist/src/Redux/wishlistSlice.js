// src/Redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosIntance";
import endpoints from "../api.json";

// 🟢 Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await API.get(endpoints.Products.wishlist);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to load wishlist");
    }
  }
);

// 🟢 Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, thunkAPI) => {
    try {
      const res = await API.post(endpoints.Products.wishlist, { product_id: productId });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to add");
    }
  }
);

// 🟢 Remove from Wishlist (Fixed URL!)
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (wishlistItemId, thunkAPI) => {
    try {
      const url = `${endpoints.Products.wishlistRemove}${wishlistItemId}/`; // 🔥 FIXED
      await API.delete(url);
      return wishlistItemId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to remove");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
