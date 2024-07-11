import { UserRefreshTokenModel } from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken";
export const generateTokens = async (req, user) => {
  try {
    const payload = { _id: user._id, role: user.role, email: user.email };
    const accessTokenExp = Math.floor(Date.now() / 1000) + 120;
    const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
    const refreshToken = jwt.sign({ ...payload }, process.env.REFRESH_TOKEN, {
      expiresIn: refreshTokenExp,
    });
    const accessToken = jwt.sign({ ...payload }, process.env.ACCESS_TOKEN, {
      expiresIn: accessTokenExp,
    });

    await UserRefreshTokenModel.findOneAndUpdate(
      { userId: user._id },
      { token: req?.cookies?.refreshToken || refreshToken },
      { upsert: true }
    );
    return {
      accessToken,
      refreshToken: req?.cookies?.refreshToken || refreshToken,
      accessTokenExp,
      refreshTokenExp,
    };
  } catch (error) {
    console.log(`Generating token error :: ${error}`);
  }
};
