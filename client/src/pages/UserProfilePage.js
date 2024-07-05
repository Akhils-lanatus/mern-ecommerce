import React from "react";
import Navbar from "../features/Navbar/Navbar";
import UserProfile from "../features/user/components/UserProfile";
const UserProfilePage = () => {
  return (
    <Navbar>
      <UserProfile />
    </Navbar>
  );
};

export default UserProfilePage;
