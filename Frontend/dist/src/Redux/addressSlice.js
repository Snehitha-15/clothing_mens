import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";
import endpoints from "../api.json";

/* =============================
   🔹 Fetch All Addresses
============================= */
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, thunkAPI) => {
    try {
      const res = await API.get(endpoints.address.list);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load addresses");
    }
  }
);

/* =============================
   🔹 Add New Address
============================= */
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (formData, thunkAPI) => {
    try {
      const res = await API.post(endpoints.address.list, formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to add address");
    }
  }
);

/* =============================
   🔹 Delete an Address
============================= */
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, thunkAPI) => {
    try {
      await API.delete(`${endpoints.address.list}${id}/`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to delete address");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (item) => item.id !== action.payload
        );
      });
  }
});

export default addressSlice.reducer;
