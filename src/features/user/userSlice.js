import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLoggedInUserOrders } from "./userAPI";

const initialState = {
  loggedInUserAllOrders: null,
};

export const fetchLoggedInUserOrdersAsync = createAsyncThunk(
  "user/fetchLoggedInUserOrders",
  async (userId) => {
    const response = await fetchLoggedInUserOrders(userId);
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
  },
});

const getLoggedInUserAllOrders = (state) => state.user.loggedInUserAllOrders;
export { getLoggedInUserAllOrders };

export default userSlice.reducer;