import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToCart, getCartItems, removeFromCart } from "./cartAPI";

const initialState = {
  item: [],
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
  async (cartItemID, { getState }) => {
    const response = await removeFromCart(cartItemID, getState);
    return response;
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.item = action.payload;
    });
    builder.addCase(getCartItemsAsync.fulfilled, (state, action) => {
      state.item = action.payload;
    });
    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      state.item = action.payload;
    });
  },
});

const getLoggedInUserCartItems = (state) => state.cart.item;
export { getLoggedInUserCartItems };

export default cartSlice.reducer;
