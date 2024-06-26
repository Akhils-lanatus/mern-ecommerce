export async function createUser(userData) {
  try {
    const response = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}

export async function checkUser(loginInfo) {
  try {
    const { email, password } = loginInfo;
    const response = await fetch(`http://localhost:8000/users?email=${email}`);
    const data = await response.json();
    if (data.length) {
      if (password === data[0].password) {
        return { data: data[0] };
      } else {
        throw new Error("Invalid Credentials");
      }
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function logoutUser(id) {
  try {
    const response = await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
    return response.status;
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
