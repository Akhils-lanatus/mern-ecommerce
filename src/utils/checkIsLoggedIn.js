import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLoggedInUser } from "../features/auth/AuthSlice";
import PageNotFound from "../pages/PageNotFound";
const UnProtected = () => {
  const loggedInUser = useSelector(getLoggedInUser);
  const location = useLocation();
  if (location.pathname === "/auth") {
    return <PageNotFound />;
  }
  if (loggedInUser?.length !== 0) return <Navigate to="/" replace={true} />;
  return <Outlet />;
};

export default UnProtected;
