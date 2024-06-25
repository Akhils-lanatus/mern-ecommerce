export const addToCart = async (cartData, getData) => {
  try {
    const response = await fetch("http://localhost:8000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartData),
    });
    const prevState = await getData().cart;
    const data = await response.json();
    return { data: [...prevState.item, data] };
  } catch (error) {
    console.log(`Error while adding to cart :: ${error} `);
  }
};

export const getCartItems = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/cart?user=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error while getCartItems :: ${error} `);
  }
};

export const removeFromCart = async (cartItemID, getState) => {
  try {
    const response = await fetch(`http://localhost:8000/cart/${cartItemID}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      const filteredData = getState().cart.item?.filter(
        (item) => item.id !== cartItemID
      );
      return filteredData;
    }
  } catch (error) {
    console.log(`Error while removing from cart :: ${error} `);
  }
};

// export const addItemQuantity = async (userId, itemId) => {
//   try {
//     const response = await fetch(
//       `http://localhost:8000/cart?user=${userId}&item.id=${id}`
//     );

//   } catch (error) {
//     console.log(`Error while adding quantity :: ${error} `);
//   }
// };
