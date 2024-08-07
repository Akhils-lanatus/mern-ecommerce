import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchLoggedInUserOrders,
  addUserAddress,
  removeUserAddress,
  updateUserAddress,
  logoutUser,
} from "./userAPI";

const initialState = {
  loggedInUserAllOrders: null,
  userInfo: [],
  isLoading: false,
  error: "",
};

export const fetchLoggedInUserOrdersAsync = createAsyncThunk(
  "user/fetchLoggedInUserOrders",
  async (userId) => {
    const response = await fetchLoggedInUserOrders(userId);
    return response;
  }
);

export const addUserAddressAsync = createAsyncThunk(
  "user/addUserAddress",
  async (data) => {
    const response = await addUserAddress(data);
    return response;
  }
);
export const removeUserAddressAsync = createAsyncThunk(
  "user/removeUserAddress",
  async (data) => {
    const response = await removeUserAddress(data);
    return response;
  }
);
export const updateUserAddressAsync = createAsyncThunk(
  "user/updateUserAddress",
  async (data) => {
    const response = await updateUserAddress(data);
    return response;
  }
);
export const logoutUserAsync = createAsyncThunk("user/logoutUser", async () => {
  const response = await logoutUser();
  return response;
});

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
      state.error = "";
    });
    builder.addCase(addUserAddressAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(addUserAddressAsync.fulfilled, (state, action) => {
      state.userInfo.data = action.payload;
      state.error = "";
      state.isLoading = false;
    });
    builder.addCase(addUserAddressAsync.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });

    builder.addCase(removeUserAddressAsync.fulfilled, (state, action) => {
      state.userInfo.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateUserAddressAsync.fulfilled, (state, action) => {
      console.log(action.payload);
      state.userInfo.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateUserAddressAsync.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(logoutUserAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUserAsync.fulfilled, (state) => {
      state.error = null;
      state.userInfo = [];
      state.isLoading = false;
    });
  },
});

const getLoggedInUserAllOrders = (state) => state.user.loggedInUserAllOrders;

const checkIsLoading = (state) => state.user.isLoading;
const getError = (state) => state.user.error;

export { getLoggedInUserAllOrders, checkIsLoading, getError };

export default userSlice.reducer;
