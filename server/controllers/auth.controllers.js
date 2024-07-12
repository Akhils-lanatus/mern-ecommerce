import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { SendOtpForEmailVerification } from "../utils/SendOtpForEmailVerification.js";
import { OtpModel } from "../models/otp.model.js";
import { generateTokens } from "../utils/generateTokens.js";
import { generateCookies } from "../utils/generateCookies.js";
import { refreshAccessToken } from "../utils/refreshAccessToken.js";
import { UserRefreshTokenModel } from "../models/refreshToken.model.js";
import { transporter } from "../config/nodemailerConfig.js";

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

export const changePasswordController = async (req, res) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;
    if (!old_password || !new_password || !confirm_password) {
      return res.status(200).json({
        success: false,
        message: "All fields are required",
      });
    }
    const token = req.cookies.refreshToken;
    const userData = await UserRefreshTokenModel.aggregate([
      {
        $match: { token },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "mergedData",
        },
      },
      {
        $addFields: {
          mergedData: { $arrayElemAt: ["$mergedData", 0] },
        },
      },
      {
        $project: {
          user_id: "$mergedData._id",
          user_password: "$mergedData.password",
          _id: 0,
        },
      },
    ]);
    if (!userData) {
      return res.status(200).json({
        success: false,
        message: "Invalid entry ",
      });
    }
    const isOldPassValid = await bcrypt.compare(
      old_password,
      userData[0].user_password
    );
    if (!isOldPassValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    if (new_password.trim() !== confirm_password.trim()) {
      return res.status(200).json({
        success: false,
        message: "Password didn't match",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(new_password, salt);
    await UserModel.findByIdAndUpdate(
      userData[0].user_id,
      {
        $set: { password: hashedPass },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(`Change Password Time Error :: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error while changing password, please try again",
    });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("is_auth");
    res.clearCookie("isVerified");

    return res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    console.log(`Logout Time Error :: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Logout failed, please try again",
    });
  }
};

export const sendPasswordResetLinkController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No such email found",
      });
    }
    const secret = user._id + process.env.ACCESS_TOKEN;
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "15m",
    });
    const resetPassLink = `${process.env.FRONTEND_HOST}/account/reset-password/${user._id}/${token}`;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Email</title>
    <style>
        /* Reset styles */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f5f5f5;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h2 {
            color: #333;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .reset-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff !important;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetPassLink}" class="reset-link">Reset Password</a>
        <p>This Link is valid for 15 minutes. Do not share this link with anyone.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
</body>
</html>
`;
    transporter.sendMail(
      {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Reset Password",
        html: htmlContent,
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          if (info.response.includes("OK")) {
            console.log(`Otp sent :: ${info}`);
          }
        }
      }
    );
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      resetPassLink,
    });
  } catch (error) {
    console.log(`sendPasswordResetLinkController Time Error :: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Link sending failed, please try again",
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password, confirm_password } = req.body;
    if (!password || !confirm_password) {
      return res.status(200).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "No such user found",
      });
    }
    const secret = user._id + process.env.ACCESS_TOKEN;
    jwt.verify(token, secret);

    if (password.trim() !== confirm_password.trim()) {
      return res.status(200).json({
        success: false,
        message: "Password didn't match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    user.password = hashedPass;
    user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(`resetPasswordController Time Error :: ${error}`);
    return res.status(500).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token Expired"
          : error.name === "JsonWebTokenError"
          ? "Invalid link"
          : "Unable to reset password, please try again",
    });
  }
};
