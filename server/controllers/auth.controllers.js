import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { SendOtpForEmailVerification } from "../utils/SendOtpForEmailVerification.js";
import { OtpModel } from "../models/otp.model.js";
import { generateTokens } from "../utils/generateTokens.js";
import { generateCookies } from "../utils/generateCookies.js";
import { refreshAccessToken } from "../utils/refreshAccessToken.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    if (!name || !email || !password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    if (password.trim() !== confirm_password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Password didn't match",
      });
    }

    const isEmailRegistered = await UserModel.findOne({ email });
    if (isEmailRegistered) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    if (!hashedPass) {
      return res.status(400).json({
        success: false,
        message: "Error in hashing pass",
      });
    }

    const user = await UserModel.create({
      name,
      email,
      password: hashedPass,
    });

    const createdUser = await UserModel.findOne(
      { _id: user._id },
      { password: 0 }
    );

    await SendOtpForEmailVerification(createdUser);
    if (!createdUser) {
      return res
        .status(200)
        .json({ success: false, message: "User registration failed" });
    }
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully, OTP Sent to email to verify",
    });
  } catch (error) {
    console.log(`Registration Time Error :: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Registration failed, please try again",
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "No such email found",
      });
    }
    if (existingUser.is_verified) {
      return res.status(200).json({
        success: false,
        message: "Already verified",
      });
    }
    const existingUserInOtpDB = await OtpModel.findOne({
      userId: existingUser._id,
    });
    if (!existingUserInOtpDB) {
      if (!existingUser.is_verified) {
        await SendOtpForEmailVerification(existingUser);
        return res.status(200).json({
          success: false,
          message: "Invalid otp, new otp sent to your email",
        });
      }
    } else {
      if (!existingUser.is_verified) {
        const currentTime = new Date();
        const otpExpirationTime = new Date(
          existingUserInOtpDB.createdAt.getTime() + 5 * 60 * 1000
        );
        if (currentTime > otpExpirationTime) {
          return res.status(200).json({
            success: false,
            message: "OTP Expired, Try Sending New One",
          });
        }
        if (existingUserInOtpDB.otp !== otp) {
          return res.status(200).json({
            success: false,
            message: "Invalid OTP",
          });
        }
      }
    }
    await UserModel.findByIdAndUpdate(existingUser._id, {
      $set: { is_verified: true },
    });
    await OtpModel.findByIdAndDelete(existingUserInOtpDB._id);
    return res.status(200).json({
      success: true,
      message: "Email Verified successfully",
    });
  } catch (error) {
    console.log(`Email Verify Time Error :: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Email verification failed, please try again",
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;
    if (!email || !password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password.trim() !== confirm_password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Password didn't match",
      });
    }
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "No such email found",
      });
    }
    if (!userExist.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Account not verified, Please verify",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(req, userExist);
    await generateCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: userExist._id,
        email: userExist.email,
        name: userExist.name,
      },
      roles: userExist.role,
      accessToken,
      refreshToken,
      accessTokenExp,
      is_auth: true,
    });
  } catch (error) {
    console.log(`Login Time Error :: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await refreshAccessToken(req);
    generateCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    res.status(200).json({
      success: true,
      message: "New tokens generated",
      accessToken,
      refreshToken,
      accessTokenExp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error?.message || "Error while generating token, please try again",
    });
  }
};

export const userProfileController = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log(`Profile fetch Time Error :: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Profile Fetching failed, please try again",
    });
  }
};
