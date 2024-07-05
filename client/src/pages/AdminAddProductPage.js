import React from "react";
import AdminNavbar from "../features/Navbar/AdminNavbar";
import AdminNewProduct from "../features/admin/components/AddNewProduct";
const AdminAddProductPage = () => {
  return (
    <AdminNavbar>
      <AdminNewProduct />
    </AdminNavbar>
  );
};

export default AdminAddProductPage;
