import React from "react";
import Navbar from "../features/Navbar/AdminNavbar";
import AllOrders from "../features/admin/components/AllOrders";
const AdminAllOrdersPage = () => {
  return (
    <Navbar>
      <AllOrders />
    </Navbar>
  );
};

export default AdminAllOrdersPage;
