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

export async function addUserAddress(userData) {
  try {
    const { user, address } = userData;
    const { country, state, city, email, phone } = address;
    let doAddressExist = false;
    if (user.addresses.length > 0) {
      user.addresses.map((elem) => {
        if (elem.email === email || elem.phone === phone) {
          if (
            elem.country?.name === country?.name &&
            elem.state?.name === state?.name &&
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

export async function removeUserAddress(userData) {
  try {
    const response = await fetch(`http://localhost:8000/users/${userData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {}
}
export async function updateUserAddress(userData) {
  try {
    const { user, address, addressIndex } = userData;
    const { country, state, city, email, phone } = address;
    let doAddressExist = false;
    if (user.addresses.length > 0) {
      user.addresses.map((elem) => {
        if (elem.email === email || elem.phone === phone) {
          if (
            elem.country?.name === country?.name &&
            elem.state?.name === state?.name &&
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
      const tempUser = { ...user };
      const tempAddress = [...tempUser.addresses];
      tempAddress?.splice(addressIndex, 1, address);
      const updatedData = { ...user, addresses: tempAddress };
      const response = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
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
export async function logoutUser(id) {
  try {
    // const response = await fetch(`http://localhost:8000/users/${id}`, {
    //   method: "DELETE",
    // });
    // return response.status;
    return true;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
