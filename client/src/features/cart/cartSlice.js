import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addItemQuantity,
  addToCart,
  emptyCartOnSuccessOrder,
  getCartItems,
  removeFromCart,
  removeItemQuantity,
} from "./cartAPI";

const initialState = {
  item: [],
  isLoading: false,
  cartItemsCount: 0,
};

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (cartData) => {
    const response = await addToCart(cartData);
    return response;
  }
);
export const getCartItemsAsync = createAsyncThunk(
  "cart/getCartItems",
  async (userId) => {
    const response = await getCartItems(userId);
    return response;
  }
);
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (data) => {
    const response = await removeFromCart(data);
    return response;
  }
);
export const emptyCartOnSuccessOrderAsync = createAsyncThunk(
  "cart/emptyCartOnSuccessOrder",
  async (userId, { getState }) => {
    const response = await emptyCartOnSuccessOrder(userId, getState);
    return response.success;
  }
);
export const addItemQuantityAsync = createAsyncThunk(
  "cart/addItemQuantity",
  async (product) => {
    const response = await addItemQuantity(product);
    return response;
  }
);
export const removeItemQuantityAsync = createAsyncThunk(
  "cart/removeItemQuantity",
  async (product) => {
    const response = await removeItemQuantity(product);
    return response;
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.item.push(action.payload.item);
      state.isLoading = false;
      state.cartItemsCount = action.payload.cartItemsCount;
    });
    builder.addCase(getCartItemsAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCartItemsAsync.fulfilled, (state, action) => {
      state.item = action.payload.cartItems;
      state.isLoading = false;
      state.cartItemsCount = action.payload.cartItemsCount;
    });

    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      state.item = [...action.payload.cartItems];
      state.isLoading = false;
      state.cartItemsCount = action.payload.cartItemsCount;
    });

    builder.addCase(emptyCartOnSuccessOrderAsync.fulfilled, (state, action) => {
      state.item = [];
      state.isLoading = false;
    });

    builder.addCase(addItemQuantityAsync.fulfilled, (state, action) => {
      const index = state.item.findIndex(
        (elem) => elem.id === action.payload.id
      );
      state.item[index] = action.payload;
      state.isLoading = false;
    });

    builder.addCase(removeItemQuantityAsync.fulfilled, (state, action) => {
      const index = state.item.findIndex(
        (elem) => elem.id === action.payload.id
      );
      state.item[index] = action.payload;
      state.isLoading = false;
    });
  },
});

const getLoggedInUserCartItems = (state) => state.cart.item;
const checkIsLoading = (state) => state.cart.isLoading;
const getCartItemsLength = (state) => state.cart.cartItemsCount;

export { getLoggedInUserCartItems, checkIsLoading, getCartItemsLength };

export default cartSlice.reducer;
