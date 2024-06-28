import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUser, checkUser, logoutUser } from "./AuthAPI";

const initialState = {
  loggedInUser: [],
  error: "",
};

export const createUserAsync = createAsyncThunk(
  "auth/createUser",
  async (userData) => {
    const response = await createUser(userData);
    return response;
  }
);

export const checkUserAsync = createAsyncThunk(
  "auth/checkUser",
  async (loginInfo) => {
    const response = await checkUser(loginInfo);
    return response;
  }
);

export const logoutUserAsync = createAsyncThunk(
  "auth/logoutUser",
  async (id) => {
    const response = await logoutUser(id);
    return response;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUserAsync.fulfilled, (state, action) => {
      state.loggedInUser = action.payload;
      state.error = null;
    });
    builder.addCase(checkUserAsync.fulfilled, (state, action) => {
      state.loggedInUser = action.payload;
      state.error = null;
    });
    builder.addCase(checkUserAsync.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(logoutUserAsync.fulfilled, (state) => {
      state.error = null;
      state.loggedInUser = [];
    });
  },
});

export const getLoggedInUser = (state) => state.auth.loggedInUser;

export default authSlice.reducer;
