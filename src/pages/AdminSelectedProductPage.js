import React from "react";
import AdminNavbar from "../features/Navbar/AdminNavbar";
import AdminSingleProduct from "../features/admin/components/AdminSingleProduct";
const AdminSelectedProductPage = () => {
  return (
    <AdminNavbar>
      <AdminSingleProduct />
    </AdminNavbar>
  );
};

export default AdminSelectedProductPage;
