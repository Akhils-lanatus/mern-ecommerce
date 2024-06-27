import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrder, fetchCurrentOrders } from "./orderAPI";

const initialState = {
  orders: [],
  currentOrders: [],
};

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (orderData) => {
    const response = await createOrder(orderData);
    return response;
  }
);
export const fetchCurrentOrdersAsync = createAsyncThunk(
  "order/fetchCurrentOrders",
  async (userId) => {
    const response = await fetchCurrentOrders(userId);
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
      state.currentOrders.push(action.payload);
    });
    builder.addCase(fetchCurrentOrdersAsync.fulfilled, (state, action) => {
      state.currentOrders = action.payload;
    });
  },
});

const getCurrentOrders = (state) => state.order.currentOrders;
export { getCurrentOrders };
export default orderSlice.reducer;
