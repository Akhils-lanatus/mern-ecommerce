import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUser, checkUser, logoutUser } from "./AuthAPI";

const initialState = {
  loggedInUser: [],
  error: "",
  isLoading: false,
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
    builder.addCase(createUserAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createUserAsync.fulfilled, (state, action) => {
      state.loggedInUser = action.payload;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(checkUserAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkUserAsync.fulfilled, (state, action) => {
      state.loggedInUser = action.payload;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(checkUserAsync.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
    builder.addCase(logoutUserAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUserAsync.fulfilled, (state) => {
      state.error = null;
      state.loggedInUser = [];
      state.isLoading = false;
    });
  },
});

export const getLoggedInUser = (state) => state.auth.loggedInUser;
export const checkIsLoading = (state) => state.auth.isLoading;
export const getLoginError = (state) => state.auth.error;

export default authSlice.reducer;
