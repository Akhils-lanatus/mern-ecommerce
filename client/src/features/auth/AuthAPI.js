import axios from "axios";

export async function createUser(userData) {
  try {
    const res = await axios.post("/auth/register", userData, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: res.data };
  } catch (error) {
    throw new Error(error);
  }
}

export async function VerifyEmail(email) {
  try {
    const response = await axios.post("/auth/verify-email", email);
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
}
export async function VerifyOtp(otp) {
  try {
    const response = await axios.post("/auth/verify-email-by-otp", otp);
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
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
