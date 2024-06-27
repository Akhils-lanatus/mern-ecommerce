import React, { useEffect } from "react";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import SingleProductPage from "./pages/SingleProductPage";
import ForgotPasswordEnterEmail from "./features/auth/components/ForgotPasswordEnterEmail";
import ForgotPasswordEnterOTP from "./features/auth/components/ForgotPasswordEnterOTP";
import Protected from "../src/features/auth/components/Protected";
import PageNotFound from "./pages/PageNotFound";
import UnProtected from "./utils/checkIsLoggedIn";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "./features/auth/AuthSlice";
import { getCartItemsAsync } from "./features/cart/cartSlice";
import OrderSuccess from "./pages/OrderSuccess";
import UserProfile from "./features/user/components/UserProfile";
import UserOrders from "./features/user/components/UserOrders";
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);
  useEffect(() => {
    if (user.length !== 0) {
      dispatch(getCartItemsAsync(user?.data?.id));
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<UnProtected />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<SignupPage />} />
          <Route
            path="forgot-password-auth-0"
            element={<ForgotPasswordEnterEmail />}
          />
          <Route
            path="forgot-password-auth-1"
            element={<ForgotPasswordEnterOTP />}
          />
        </Route>
        <Route path="" element={<Protected />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/your-orders" element={<UserOrders />} />
        </Route>
        <Route path="/selected-product/:id" element={<SingleProductPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
