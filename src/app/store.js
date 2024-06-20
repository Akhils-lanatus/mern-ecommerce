import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/product-list/ProductSlice";

export const store = configureStore({
  reducer: {
    product: productsReducer,
  },
});
