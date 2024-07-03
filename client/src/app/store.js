import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/product-list/ProductSlice";
import authReducer from "../features/auth/AuthSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/Order/orderSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    product: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
  },
});
