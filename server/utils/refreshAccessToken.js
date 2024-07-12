import { UserRefreshTokenModel } from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { generateTokens } from "./generateTokens.js";
export const refreshAccessToken = async (req) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const userRefreshToken = await UserRefreshTokenModel.findOne({
      token: oldRefreshToken,
    });
    if (!userRefreshToken) {
      throw new Error("Invalid token");
    }
    const verifiedToken = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN
    );

    const user = await UserModel.findById(verifiedToken._id);
    if (!user) {
      throw new Error("User not found");
    }

    if (oldRefreshToken !== userRefreshToken.token) {
      throw new Error("Unauthorized access");
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp >= verifiedToken.exp) {
      throw new Error("Refresh token has expired");
    }

    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(req, user);

    return {
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp,
    };
  } catch (error) {
    throw error;
  }
};
