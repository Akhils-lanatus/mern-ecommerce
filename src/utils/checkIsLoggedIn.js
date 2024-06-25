import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLoggedInUser } from "../features/auth/AuthSlice";
const UnProtected = () => {
  const loggedInUser = useSelector(getLoggedInUser);
  if (loggedInUser?.length !== 0) return <Navigate to="/" replace={true} />;
  return <Outlet />;
};

export default UnProtected;
