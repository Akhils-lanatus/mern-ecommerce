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
    const response = await axios.post("/auth/verify-email-by-otp", otp, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
}

export async function loginUser(loginInfo) {
  try {
    const response = await axios.post(`/auth/login`, loginInfo, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
}
export async function changePassword(changePasswordInfo) {
  try {
    const response = await axios.post(
      `/auth/change-password`,
      changePasswordInfo
    );
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
}
export async function sendForgotPassLink(email) {
  try {
    const response = await axios.post(`/auth/forgot-password-link`, email);
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
}

export async function logoutUser(id) {
  try {
    const response = await axios.get(`/auth/logout`, { withCredentials: true });
    return response.data;
  } catch (error) {
    const errors = error.response?.data;
    throw new Error(JSON.stringify(errors));
  }
}
