import React from "react";
import Navbar from "../features/Navbar/Navbar";
import ProductHome from "../features/product-list/components/ProductHome";
const Home = () => {
  return (
    <Navbar>
      <ProductHome></ProductHome>
    </Navbar>
  );
};

export default Home;
