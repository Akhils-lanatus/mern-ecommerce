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
};

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { getState }) => {
    const response = await addToCart(cartData, getState);
    return response.data;
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
  async (cartItemID) => {
    const response = await removeFromCart(cartItemID);
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
      state.item.push(action.payload);
      state.isLoading = false;
    });
    builder.addCase(getCartItemsAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCartItemsAsync.fulfilled, (state, action) => {
      state.item = action.payload;
      state.isLoading = false;
    });

    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      // console.log(action.payload);
      // const index = state.item.findIndex((elem) => console.log(elem));
      // state.item.splice(index, 1);
      state.isLoading = false;
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

export { getLoggedInUserCartItems, checkIsLoading };

export default cartSlice.reducer;
