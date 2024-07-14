import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  loginUser,
  logoutUser,
  VerifyEmail,
  VerifyOtp,
} from "./AuthAPI";

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

export const VerifyEmailAsync = createAsyncThunk(
  "auth/verifyEmail",
  async (email) => {
    const response = await VerifyEmail(email);
    return response;
  }
);
export const VerifyOtpAsync = createAsyncThunk(
  "auth/verifyOtp",
  async (otp) => {
    const response = await VerifyOtp(otp);
    return response;
  }
);

export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async (loginInfo) => {
    const response = await loginUser(loginInfo);
    return response;
  }
);

export const logoutUserAsync = createAsyncThunk("auth/logoutUser", async () => {
  const response = await logoutUser();
  return response;
});

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
    builder.addCase(createUserAsync.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
    builder.addCase(VerifyEmailAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(VerifyEmailAsync.fulfilled, (state, action) => {
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(VerifyEmailAsync.rejected, (state, action) => {
      state.error = JSON.parse(action.error.message);
      state.isLoading = false;
    });

    builder.addCase(loginUserAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUserAsync.fulfilled, (state, action) => {
      state.loggedInUser = action.payload;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(loginUserAsync.rejected, (state, action) => {
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
export const getAuthError = (state) => state.auth.error;

export default authSlice.reducer;
