import React from "react";
import Cookie from "js-cookie";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
const UnProtected = () => {
  const location = useLocation();
  if (location.pathname === "/auth") {
    return <PageNotFound />;
  }
  return Cookie.get("is_auth") ? <Navigate to={"/"} /> : <Outlet />;
};

export default UnProtected;
