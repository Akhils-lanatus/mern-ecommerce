export async function createUser(userData) {
  try {
    const res = await fetch(
      `http://localhost:8000/users?email=${userData?.email}`
    );
    const isEmailRegistered = await res.json();
    if (!isEmailRegistered?.length) {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return { data };
    } else {
      throw new Error("Email Alreay Registered");
    }
  } catch (error) {
    throw new Error(error);
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
    // const response = await fetch(`http://localhost:8000/users/${id}`, {
    //   method: "DELETE",
    // });
    // return response.status;
    return true;
  } catch (error) {
    console.log(`Error :: ${error}`);
  }
}
