import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLoggedInUserOrdersAsync,
  getLoggedInUserAllOrders,
} from "../userSlice";
import { getLoggedInUser } from "../../auth/AuthSlice";
const UserOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUser);
  const allOrders = useSelector(getLoggedInUserAllOrders(user.data.id));

  useEffect(() => {
    dispatch(fetchLoggedInUserOrdersAsync());
  }, [dispatch]);
  return <div>UserOrders</div>;
};

export default UserOrders;
