import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLoggedInUser } from "../AuthSlice";
const Protected = () => {
  const loggedInUser = useSelector(getLoggedInUser);
  if (loggedInUser.length === 0) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  return <Outlet />;
};

export default Protected;
