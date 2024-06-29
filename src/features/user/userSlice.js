import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchLoggedInUserOrders,
  updateUserFromCheckout,
  fetchLoggedInUser,
} from "./userAPI";

const initialState = {
  loggedInUserAllOrders: null,
  userInfo: [],
  isLoading: false,
};

export const fetchLoggedInUserOrdersAsync = createAsyncThunk(
  "user/fetchLoggedInUserOrders",
  async (userId) => {
    const response = await fetchLoggedInUserOrders(userId);
    return response;
  }
);
export const fetchLoggedInUserAsync = createAsyncThunk(
  "user/fetchLoggedInUser",
  async (userId) => {
    const response = await fetchLoggedInUser(userId);
    return response;
  }
);

export const updateUserFromCheckoutAsync = createAsyncThunk(
  "auth/updateUserFromCheckout",
  async (data) => {
    const response = await updateUserFromCheckout(data);
    return response;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLoggedInUserOrdersAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLoggedInUserOrdersAsync.fulfilled, (state, action) => {
      state.loggedInUserAllOrders = action.payload;
      state.isLoading = false;
    });
    builder.addCase(updateUserFromCheckoutAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserFromCheckoutAsync.fulfilled, (state, action) => {
      state.userInfo.data = action.payload;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(updateUserFromCheckoutAsync.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(fetchLoggedInUserAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.error = null;
      state.isLoading = false;
    });
  },
});

const getLoggedInUserAllOrders = (state) => state.user.loggedInUserAllOrders;
const getLoggedInUserInfo = (state) => state.user.userInfo;
const checkIsLoading = (state) => state.user.isLoading;

export { getLoggedInUserAllOrders, getLoggedInUserInfo, checkIsLoading };

export default userSlice.reducer;
