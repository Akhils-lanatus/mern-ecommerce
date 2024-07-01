import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageNotFound from "../pages/PageNotFound";
import {
  fetchLoggedInUserAsync,
  getLoggedInUserInfo,
} from "../features/user/userSlice";
import { getLoggedInUser } from "../features/auth/AuthSlice";
const UnProtected = () => {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);
  useEffect(() => {
    if (user.length !== 0) {
      dispatch(fetchLoggedInUserAsync(user?.data?.id));
    }
  }, [dispatch, user]);
  const loggedInUser = useSelector(getLoggedInUserInfo);
  const location = useLocation();
  if (location.pathname === "/auth") {
    return <PageNotFound />;
  }
  if (user?.length !== 0 && loggedInUser?.length !== 0)
    return <Navigate to="/" replace={true} />;
  return <Outlet />;
};

export default UnProtected;
