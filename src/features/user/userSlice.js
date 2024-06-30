import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchLoggedInUserOrders,
  updateUserAddress,
  fetchLoggedInUser,
  removeUserAddress,
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

export const updateUserAddressAsync = createAsyncThunk(
  "auth/updateUserAddress",
  async (data) => {
    const response = await updateUserAddress(data);
    return response;
  }
);
export const removeUserAddressAsync = createAsyncThunk(
  "auth/removeUserAddress",
  async (data) => {
    const response = await removeUserAddress(data);
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
    builder.addCase(updateUserAddressAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserAddressAsync.fulfilled, (state, action) => {
      state.userInfo.data = action.payload;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(updateUserAddressAsync.rejected, (state, action) => {
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
    builder.addCase(removeUserAddressAsync.fulfilled, (state, action) => {
      state.userInfo.data = action.payload;
    });
  },
});

const getLoggedInUserAllOrders = (state) => state.user.loggedInUserAllOrders;
const getLoggedInUserInfo = (state) => state.user.userInfo;
const checkIsLoading = (state) => state.user.isLoading;

export { getLoggedInUserAllOrders, getLoggedInUserInfo, checkIsLoading };

export default userSlice.reducer;
