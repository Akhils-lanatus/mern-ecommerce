import React from "react";
import Navbar from "../features/Navbar/Navbar";
import Footer from "../features/Footer/Footer";
import UserProfile from "../features/user/components/UserProfile";
const UserProfilePage = () => {
  return (
    <>
      <Navbar>
        <UserProfile />
      </Navbar>
      <Footer />
    </>
  );
};

export default UserProfilePage;
