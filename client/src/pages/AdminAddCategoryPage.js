import React from "react";
import AdminNavbar from "../features/Navbar/AdminNavbar";
import AddNewCategory from "../features/admin/components/AddNewCategory";
const AdminAddProductPage = () => {
  return (
    <AdminNavbar>
      <AddNewCategory />
    </AdminNavbar>
  );
};

export default AdminAddProductPage;
