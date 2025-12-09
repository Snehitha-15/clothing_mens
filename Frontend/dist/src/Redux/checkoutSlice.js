import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";
import endpoints from "../api.json";

export const createOrder = createAsyncThunk(
  "checkout/createOrder",
  async (payload, thunkAPI) => {
    try {
      const res = await API.post(endpoints.checkout.createOrder, payload);
      return res.data;
    } catch (err) {
      console.log("❌ ERROR CREATE ORDER:", err.response?.data);
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error creating order"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "checkout/verifyPayment",
  async (payload, thunkAPI) => {
    try {
      const res = await API.post(endpoints.checkout.verifyPayment, payload);
      return res.data;
    } catch (err) {
      console.log("❌ VERIFY ERROR:", err.response?.data);
      return thunkAPI.rejectWithValue(
        err.response?.data || "Payment verification failed"
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: { loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default checkoutSlice.reducer;
