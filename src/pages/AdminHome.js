import React from "react";
import AdminNavbar from "../features/Navbar/AdminNavbar";
import AdminProductHome from "../features/admin/components/AdminProductHome";
const AdminHome = () => {
  return (
    <AdminNavbar>
      <AdminProductHome />
    </AdminNavbar>
  );
};

export default AdminHome;
