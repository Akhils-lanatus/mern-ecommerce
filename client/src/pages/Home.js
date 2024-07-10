import React from "react";
import Navbar from "../features/Navbar/Navbar";
import Footer from "../features/Footer/Footer";
import ProductHome from "../features/product-list/components/ProductHome";
const Home = () => {
  return (
    <>
      <Navbar>
        <ProductHome />
      </Navbar>
      <Footer />
    </>
  );
};

export default Home;
