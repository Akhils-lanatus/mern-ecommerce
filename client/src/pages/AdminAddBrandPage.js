import React from "react";
import AdminNavbar from "../features/Navbar/AdminNavbar";
import AddNewBrand from "../features/admin/components/AddNewBrand";
const AdminAddProductPage = () => {
  return (
    <AdminNavbar>
      <AddNewBrand />
    </AdminNavbar>
  );
};

export default AdminAddProductPage;
