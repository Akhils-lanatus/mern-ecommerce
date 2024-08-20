import React, { useEffect } from "react";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import SingleProductPage from "./pages/SingleProductPage";
import ForgotPasswordEnterEmail from "./features/auth/components/ForgotPasswordEnterEmail";
import Protected from "./features/auth/components/Protected";
import PageNotFound from "./pages/PageNotFound";
import UnProtected from "./utils/checkIsLoggedIn";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "./features/auth/AuthSlice";
import { getCartItemsAsync } from "./features/cart/cartSlice";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import AdminProtected from "./features/auth/components/ProtectedAdmin";
import AdminHome from "./pages/AdminHome";
import AdminSelectedProductPage from "./pages/AdminSelectedProductPage";
import {
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
} from "./features/product-list/ProductSlice";
import AdminAllOrdersPage from "./pages/AdminAllOrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserAddAddressPage from "./pages/UserAddAddressPage";
import UserUpdateAddressPage from "./pages/UserUpdateAddressPage";
import AdminAddProductPage from "./pages/AdminAddProductPage";
import AdminAddCategoryPage from "./pages/AdminAddCategoryPage";
import AdminAddBrandPage from "./pages/AdminAddBrandPage";
import AdminEditProductPage from "./pages/AdminEditProductPage";
import VerifyEmail from "./features/auth/components/VerifyEmail";
import ChangePassword from "./features/auth/components/ChangePassword";
import ForgotPasswordEnterPass from "./features/auth/components/ForgotPasswordEnterPass";
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);

  useEffect(() => {
    dispatch(fetchAllBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
    if (user.length !== 0) {
      dispatch(getCartItemsAsync(user?.user?.id));
    }
  }, [dispatch, user]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* UnProtected */}
          <Route path="/auth">
            {/* <Route path="/auth" element={<UnProtected />}> */}
            <Route path="login" element={<LoginPage />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="register" element={<SignupPage />} />
            <Route
              path="forgot-password-auth-0"
              element={<ForgotPasswordEnterEmail />}
            />
            <Route
              path="forgot-password-auth-1/:id/:token"
              element={<ForgotPasswordEnterPass />}
            />
          </Route>
          {/* Protected */}
          {/* <Route path="" element={<Protected />}> */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/my-orders" element={<UserOrdersPage />} />
          <Route path="/add-address" element={<UserAddAddressPage />} />
          <Route
            path="/update-address/:id"
            element={<UserUpdateAddressPage />}
          />
          {/* </Route> */}
          {/* Admin Protected */}
          <Route path="/admin">
            {/* <Route path="/admin" element={<AdminProtected />}> */}
            <Route path="home" element={<AdminHome />} />
            <Route path="add-product" element={<AdminAddProductPage />} />
            <Route path="add-category" element={<AdminAddCategoryPage />} />
            <Route path="add-brand" element={<AdminAddBrandPage />} />
            <Route path="edit-product/:id" element={<AdminEditProductPage />} />
            <Route
              path="/admin/selected-product"
              element={<AdminSelectedProductPage />}
            />
            <Route path="/admin/all-orders" element={<AdminAllOrdersPage />} />
          </Route>
          <Route path="/selected-product/:id" element={<SingleProductPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
};

export default App;
