import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
export const checkIsAdmin = async (req, res, next) => {
  try {
    const accessToken = req.headers["authorization"]?.replace("Bearer ", "");
    if (!accessToken) {
      throw new Error("Invalid entry - Try again");
    }
    const verifiedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    console.log(verifiedToken);
    const role = verifiedToken.role;
    if (role !== "admin") {
      const error = new Error("Unauthorized access - Please Login");
      error.unAuth = true;
      throw error;
    }
    next();
  } catch (error) {
    const customFields = {};
    for (let key in error) {
      if (error.hasOwnProperty(key)) {
        customFields[key] = error[key];
      }
    }
    const message = errorHandler(error);
    return res.status(400).json({
      success: false,
      message,
      ...customFields,
    });
  }
};
