import Navbar from "../features/Navbar/Navbar";
import Footer from "../features/Footer/Footer";
import SingleProduct from "../features/product-list/components/SingleProduct";

const SingleProductPage = () => {
  return (
    <>
      <Navbar>
        <SingleProduct />
      </Navbar>
      <Footer />
    </>
  );
};

export default SingleProductPage;
