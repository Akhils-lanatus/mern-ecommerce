import { UserRefreshTokenModel } from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken";
export const generateTokens = async (req, user) => {
  try {
    const payload = { _id: user._id, role: user.role, email: user.email };
    const accessTokenExp = Math.floor(Date.now() / 1000) + 120;
    const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
    const refreshToken =
      req?.cookies?.refreshToken ||
      jwt.sign({ ...payload, exp: refreshTokenExp }, process.env.REFRESH_TOKEN);
    const accessToken = jwt.sign(
      { ...payload, exp: accessTokenExp },
      process.env.ACCESS_TOKEN
    );

    await UserRefreshTokenModel.findOneAndUpdate(
      { userId: user._id },
      { token: refreshToken },
      { upsert: true }
    );
    return {
      accessToken,
      refreshToken: refreshToken,
      accessTokenExp,
      refreshTokenExp,
    };
  } catch (error) {
    console.log(`Generating token error :: ${error}`);
  }
};
