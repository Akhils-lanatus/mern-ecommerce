import React from "react";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import SingleProductPage from "./pages/SingleProductPage";
import ForgotPasswordEnterEmail from "./features/auth/components/ForgotPasswordEnterEmail";
import ForgotPasswordEnterOTP from "./features/auth/components/ForgotPasswordEnterOTP";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route
          path="/forgot-password-auth-0"
          element={<ForgotPasswordEnterEmail />}
        />
        <Route
          path="/forgot-password-auth-1"
          element={<ForgotPasswordEnterOTP />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/selected-product/:id" element={<SingleProductPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
