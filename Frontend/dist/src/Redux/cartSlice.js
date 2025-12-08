import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance"; // YOUR file name spelling kept same
import endpoints from "../api.json";

/* =============================
   🔹 Fetch Cart
============================= */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      return (await API.get(endpoints.cart.cartDetail)).data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error loading cart");
    }
  }
);

/* =============================
   🔹 Add / Update Cart (Backend)
============================= */
export const addOrUpdateCart = createAsyncThunk(
  "cart/addOrUpdate",
  async ({ product_id, quantity }, thunkAPI) => {
    try {
      return (
        await API.post(endpoints.cart.cart, {
          product_id,
          quantity,
        })
      ).data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error updating cart");
    }
  }
);

/* =============================
   ⭐ ADD-TO-CART (keeps old code working)
============================= */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product, thunkAPI) => {
    try {
      const result = await thunkAPI.dispatch(
        addOrUpdateCart({ product_id: product.id, quantity: 1 })
      );

      return result.payload;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error adding to cart");
    }
  }
);

/* =============================
   🔹 Remove Cart Item
============================= */
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId, thunkAPI) => {
    try {
      await API.delete(`${endpoints.cart.cart}${itemId}/`);
      return itemId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error removing item");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
  },

  reducers: {
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalAmount += item.price;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalAmount -= item.price;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      /* FETCH CART */
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.total_amount || 0;
      })

      /* ADD / UPDATE CART */
      .addCase(addOrUpdateCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.total_amount;
      })

      /* REMOVE ITEM */
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);

        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });
  },
});

export const { increaseQuantity, decreaseQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
