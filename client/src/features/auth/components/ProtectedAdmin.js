import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLoggedInUser } from "../AuthSlice";
import PageNotFound from "../../../pages/PageNotFound";
const AdminProtected = () => {
  const location = useLocation();
  const loggedInUser = useSelector(getLoggedInUser);
  if (loggedInUser.length === 0) {
    return (
      <Navigate
        to="/auth/login"
        replace={true}
        state={{ prev: location.pathname }}
      />
    );
  }
  if (loggedInUser.length > 0 && loggedInUser.data.role !== "admin") {
    return (
      <Navigate
        to="/auth/login"
        replace={true}
        state={{ prev: location.pathname }}
      />
    );
  }
  if (location.pathname === "/admin") {
    return <PageNotFound />;
  }
  return <Outlet />;
};

export default AdminProtected;
