import React from "react";
import Navbar from "../features/Navbar/Navbar";
import UserOrders from "../features/user/components/UserOrders";

const UserOrdersPage = () => {
  return (
    <Navbar>
      <UserOrders />
    </Navbar>
  );
};

export default UserOrdersPage;
