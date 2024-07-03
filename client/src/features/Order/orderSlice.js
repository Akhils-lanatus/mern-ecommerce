import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrder } from "./orderAPI";

const initialState = {
  orders: [],
  currentOrders: [],
  isLoading: false,
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
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrders = [];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(createOrderAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createOrderAsync.fulfilled, (state, action) => {
      state.orders.push(action.payload);
      state.currentOrders = action.payload;
      state.isLoading = false;
    });
  },
});
const { clearCurrentOrder } = orderSlice.actions;
export { clearCurrentOrder };
const getCurrentOrders = (state) => state.order.currentOrders;
const checkIsLoading = (state) => state.order.isLoading;

export { getCurrentOrders, checkIsLoading };
export default orderSlice.reducer;
