import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";
import endpoints from "../api.json";

/* Fetch Cart */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await API.get(endpoints.cart.cartDetail);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load cart");
    }
  }
);

/* Add / Update Cart */
export const addOrUpdateCart = createAsyncThunk(
  "cart/addOrUpdate",
  async ({ variant, quantity }, thunkAPI) => {
    try {
      const res = await API.post(endpoints.cart.add, {
        variant_id: variant,
        quantity: quantity
      });
      return res.data;
    } catch (err) {
      console.log("ADD CART ERROR:", err.response?.data || err);
      return thunkAPI.rejectWithValue("Failed to update cart");
    }
  }
);

/* Remove Item */
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId, thunkAPI) => {
    try {
      await API.delete(`${endpoints.cart.remove}${itemId}/`);
      return itemId;
    } catch (err) {
      console.log("REMOVE ERROR:", err.response?.data || err);
      return thunkAPI.rejectWithValue("Failed to remove item");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false
  },

  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.total || 0;
      })

      .addCase(addOrUpdateCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.total;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);

        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );
      });
  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
