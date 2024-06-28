import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchLoggedInUserOrders,
  updateUserFromCheckout,
  fetchLoggedInUser,
} from "./userAPI";

const initialState = {
  loggedInUserAllOrders: null,
  userInfo: [],
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
    builder.addCase(fetchLoggedInUserOrdersAsync.fulfilled, (state, action) => {
      state.loggedInUserAllOrders = action.payload;
    });
    builder.addCase(updateUserFromCheckoutAsync.fulfilled, (state, action) => {
      state.userInfo.data = action.payload;
      state.error = null;
    });
    builder.addCase(updateUserFromCheckoutAsync.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.error = null;
    });
  },
});

const getLoggedInUserAllOrders = (state) => state.user.loggedInUserAllOrders;
const getLoggedInUserInfo = (state) => state.user.userInfo;
export { getLoggedInUserAllOrders, getLoggedInUserInfo };

export default userSlice.reducer;
