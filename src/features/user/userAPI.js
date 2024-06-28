export async function fetchLoggedInUserOrders(userId) {
  try {
    const res = await fetch("http://localhost:8000/orders?user.id=" + userId);
    const data = await res.json();
    data.sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    return data;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
export async function fetchLoggedInUser(userId) {
  try {
    const res = await fetch("http://localhost:8000/users/" + userId);
    const data = await res.json();
    return { data };
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}

export async function updateUserFromCheckout(userData) {
  try {
    const { user, address } = userData;
    const { country, state, city, email, phone } = address;
    let doAddressExist = false;
    if (user.addresses.length > 0) {
      user.addresses.map((elem) => {
        if (elem.email === email || elem.phone === phone) {
          if (
            elem.country === country &&
            elem.state === state &&
            elem.city === city &&
            elem.address.trim().toLowerCase() ===
              address.address.trim().toLowerCase()
          ) {
            doAddressExist = true;
          }
        }
      });
    }
    if (!doAddressExist) {
      const updatedAddresses = [...user.addresses, address];
      const tempUser = { ...user, addresses: updatedAddresses };
      const response = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempUser),
      });
      const data = await response.json();
      return data;
    } else {
      throw new Error("Address Already Added");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
