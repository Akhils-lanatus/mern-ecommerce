import React from "react";
import AdminNavbar from "../features/Navbar/AdminNavbar";
import EditProduct from "../features/admin/components/EditProduct";
const AdminEditProductPage = () => {
  return (
    <AdminNavbar>
      <EditProduct />
    </AdminNavbar>
  );
};

export default AdminEditProductPage;
