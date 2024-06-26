import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrder } from "./orderAPI";

const initialState = {
  orders: [],
};

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (orderData) => {
    const response = await createOrder(orderData);
    return response;
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(createOrderAsync.fulfilled, (state, action) => {
      state.orders.push(action.payload);
    });
  },
});

export default orderSlice.reducer;
