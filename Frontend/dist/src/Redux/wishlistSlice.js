// 📌 src/Redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";
import endpoints from "../api.json";

// 🟢 Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await API.get(endpoints.Products.wishlist);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to load wishlist"
      );
    }
  }
);

// 🟢 Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, thunkAPI) => {
    try {
      const res = await API.post(endpoints.Products.wishlist, {
        product_id: productId,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to add"
      );
    }
  }
);

// 🟢 Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (wishlistItemId, thunkAPI) => {
    try {
      await API.delete(`${endpoints.Products.wishlistRemove}${wishlistItemId}/`);
      return wishlistItemId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to remove"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    // 🔥 Fix: Now clearWishlist exists!
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions; // 🔥 FIXED
export default wishlistSlice.reducer;
