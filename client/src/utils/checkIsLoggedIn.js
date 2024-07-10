import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PageNotFound from "../pages/PageNotFound";
import { getLoggedInUserInfo } from "../features/user/userSlice";
import { getLoggedInUser } from "../features/auth/AuthSlice";
const UnProtected = () => {
  const user = useSelector(getLoggedInUser);

  const loggedInUser = useSelector(getLoggedInUserInfo);
  const role = loggedInUser?.data?.role || "";
  const isAdmin = role === "" ? false : role === "user" ? false : true;
  const location = useLocation();
  if (location.pathname === "/auth") {
    return <PageNotFound />;
  }
  if (user?.length !== 0 && loggedInUser?.length !== 0)
    return <Navigate to={isAdmin ? "/admin/home" : "/"} replace={true} />;
  return <Outlet />;
};

export default UnProtected;
