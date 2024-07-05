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
import Protected from "./features/auth/components/Protected";
import PageNotFound from "./pages/PageNotFound";
import UnProtected from "./utils/checkIsLoggedIn";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "./features/auth/AuthSlice";
import { getCartItemsAsync } from "./features/cart/cartSlice";
import UserProfile from "./features/user/components/UserProfile";
import UserOrders from "./features/user/components/UserOrders";
import AddAddress from "./features/user/components/AddAddress";
import UpdateAddress from "./features/user/components/UpdateAddress";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import AdminProtected from "./features/auth/components/ProtectedAdmin";
import AdminHome from "./pages/AdminHome";
import AdminSelectedProductPage from "./pages/AdminSelectedProductPage";
import AddNewProduct from "./features/admin/components/AddNewProduct";
import {
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
} from "./features/product-list/ProductSlice";
import EditProduct from "./features/admin/components/EditProduct";
import AdminAllOrdersPage from "./pages/AdminAllOrdersPage";
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);
  useEffect(() => {
    if (user.length !== 0) {
      dispatch(getCartItemsAsync(user?.data?.id));
      dispatch(fetchAllBrandsAsync());
      dispatch(fetchAllCategoriesAsync());
    }
  }, [dispatch, user]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* UnProtected */}
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
          {/* Protected */}
          <Route path="" element={<Protected />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-orders" element={<UserOrders />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/update-address/:id" element={<UpdateAddress />} />
          </Route>
          {/* Admin Protected */}
          <Route path="/admin" element={<AdminProtected />}>
            <Route path="home" element={<AdminHome />} />
            <Route path="add-product" element={<AddNewProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route
              path="/admin/selected-product/:id"
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
