import axios from "axios";

export const addToCart = async (cartData) => {
  try {
    const response = await axios.post("/cart/addToCart", cartData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};

export const getCartItems = async (userId) => {
  try {
    const response = await axios.get(`/cart/getCartItems?uId=${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};

export const removeFromCart = async (data) => {
  try {
    const response = await axios.post("/cart/removeFromCart", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
};

export const emptyCartOnSuccessOrder = async (userId, getState) => {
  try {
    const response = await getCartItems(userId);
    for (let items in response) {
      await removeFromCart(response[items].id, getState);
    }
    return { success: "success" };
  } catch (error) {
    console.log(`Error while getCartItems :: ${error} `);
  }
};

export const addItemQuantity = async (product) => {
  try {
    const pdt = { ...product, quantity: product.quantity + 1 };
    const response = await fetch(`http://localhost:8000/cart/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pdt),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error while adding quantity :: ${error} `);
  }
};
export const removeItemQuantity = async (product) => {
  try {
    const pdt = { ...product, quantity: product.quantity - 1 };
    const response = await fetch(`http://localhost:8000/cart/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pdt),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error while adding quantity :: ${error} `);
  }
};
