import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrder, fetchAllOrders, updateOrderStatus } from "./orderAPI";

const initialState = {
  orders: [],
  currentOrders: [],
  isLoading: false,
  allOrders: [],
  totalOrders: 0,
};

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (orderData) => {
    const response = await createOrder(orderData);
    return response;
  }
);
export const fetchAllOrdersAsync = createAsyncThunk(
  "order/fetchAllOrders",
  async ({ sort, pagination }) => {
    const response = await fetchAllOrders({ sort, pagination });
    return response;
  }
);
export const updateOrderStatusAsync = createAsyncThunk(
  "order/updateOrderStatus",
  async (order) => {
    const response = await updateOrderStatus(order);
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
    builder.addCase(fetchAllOrdersAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
      state.allOrders = action.payload.orders;
      state.totalOrders = action.payload.totalOrders;
      state.isLoading = false;
    });
    builder.addCase(updateOrderStatusAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
      const index = state.allOrders.findIndex(
        (elem) => elem.id === action.payload.id
      );
      state.allOrders[index] = action.payload;
      state.isLoading = false;
    });
  },
});
const { clearCurrentOrder } = orderSlice.actions;
export { clearCurrentOrder };
const getCurrentOrders = (state) => state.order.currentOrders;
const checkIsLoading = (state) => state.order.isLoading;
const getAllOrders = (state) => state.order.allOrders;
const getTotalOrders = (state) => state.order.totalOrders;

export { getCurrentOrders, checkIsLoading, getAllOrders, getTotalOrders };
export default orderSlice.reducer;
