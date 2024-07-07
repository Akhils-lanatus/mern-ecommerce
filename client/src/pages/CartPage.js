import Footer from "../features/Footer/Footer";
import Navbar from "../features/Navbar/Navbar";
import Cart from "../features/cart/Cart";
const CartPage = () => {
  return (
    <>
      <Navbar>
        <Cart />
      </Navbar>
      <Footer />
    </>
  );
};

export default CartPage;
