// src/Redux/myOrderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// 📌 GET MY ORDERS
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📡 Fetching My Orders...");
      const res = await axiosInstance.get("/api/my-orders/");
      console.log("✅ My Orders Response:", res.data);
      return res.data;
    } catch (error) {
      console.log("❌ My Orders Error:", error);
      return rejectWithValue("Failed to load your orders");
    }
  }
);

// 📌 CANCEL ORDER
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log(`📡 Cancelling Order ID: ${orderId}`);
      const res = await axiosInstance.post(`/api/orders/${orderId}/cancel/`);
      console.log("✅ Cancel Order API Response:", res.data);
      return { orderId, data: res.data };
    } catch (err) {
      console.log("❌ Cancel Order Error:", err);
      return rejectWithValue("Failed to cancel order");
    }
  }
);

// 📌 TRACK ORDER
export const trackOrder = createAsyncThunk(
  "orders/trackOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log(`📡 Fetching Tracking for Order: ${orderId}`);
      const res = await axiosInstance.get(`/api/orders/${orderId}/track/`);
      console.log("🔎 Tracking Response:", res.data);
      return { orderId, tracking: res.data };
    } catch (err) {
      console.log("❌ Tracking Error:", err);
      return rejectWithValue("Failed to fetch order tracking");
    }
  }
);

const myOrdersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // LOAD ORDERS
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CANCEL ORDER (FIXED)
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const { orderId } = action.payload;
        const order = state.list.find((o) => o.id === orderId);

        if (order) {
          console.log("🔄 Updating cancelled order:", order);

          // IMPORTANT FIX — match backend EXACTLY
          order.status = "CANCELLED";

          // ensure tracking exists (prevent map undefined error)
          if (!order.tracking) {
            order.tracking = { timeline: [] };
          }
        }
      })

      // TRACK ORDER (FIXED)
      .addCase(trackOrder.fulfilled, (state, action) => {
        const { orderId, tracking } = action.payload;
        const order = state.list.find((o) => o.id === orderId);

        if (order) {
          console.log("📦 Storing Tracking Data:", tracking);
          order.tracking = tracking;
        }
      });
  },
});

export default myOrdersSlice.reducer;
