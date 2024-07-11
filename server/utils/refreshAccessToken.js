import { UserRefreshTokenModel } from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken";
export const refreshAccessToken = async (req) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    console.log(oldRefreshToken);
    const userRefreshToken = await UserRefreshTokenModel.findOne({
      token: oldRefreshToken,
    });
    if (!userRefreshToken) {
      throw new Error("Invalid token");
    }
    const verifiedToken = jwt.decode(oldRefreshToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    console.log({ verifiedToken });

    if (currentTimestamp >= verifiedToken.exp) {
      throw new Error("Refresh token has expired");
    }
  } catch (error) {
    throw error;
  }
};
