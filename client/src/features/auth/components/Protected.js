import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLoggedInUser } from "../AuthSlice";
const Protected = () => {
  const location = useLocation();
  const loggedInUser = useSelector(getLoggedInUser);
  console.log(loggedInUser);

  if (loggedInUser.length === 0) {
    return (
      <Navigate
        to="/auth/login"
        replace={true}
        state={{ prev: location.pathname }}
      />
    );
  }
  if (
    loggedInUser?.data?.role === "admin" ||
    (loggedInUser.length > 0 && loggedInUser.data.role !== "user")
  ) {
    return (
      <Navigate
        to="/auth/login"
        replace={true}
        state={{ prev: location.pathname }}
      />
    );
  }
  return <Outlet />;
};

export default Protected;
