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
import { errorHandler } from "../utils/errorHandler.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    if (!name || !email || !password || !confirm_password) {
      throw new Error("Please fill all fields");
    }
    if (password.trim() !== confirm_password.trim()) {
      throw new Error("Password didn't match");
    }

    await UserModel.findOne({ email });
    //if already registered will show duplicate error - 11000

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    if (!hashedPass) {
      throw new Error("Error in hashing pass");
    }

    const user = await UserModel.create({
      name,
      email,
      password: hashedPass,
    });

    const createdUser = await UserModel.findOne(
      { _id: user._id },
      { name: 1, email: 1, role: 1 }
    );

    await SendOtpForEmailVerification(createdUser);
    if (!createdUser) {
      throw new Error("User registration failed");
    }
    res.cookie("session_same", email);
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully, OTP Sent to email to verify",
      user: createdUser,
    });
  } catch (error) {
    const message = errorHandler(error) || "Internal server error";
    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Please enter email");
    }
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new Error("No such email found");
    }
    if (existingUser.is_verified) {
      throw new Error("Already verified, Kindly login");
    }
    res.cookie("session_same", email);
    const existingUserInOtpDB = await OtpModel.findOne({
      userId: existingUser._id,
    });
    if (!existingUserInOtpDB) {
      if (!existingUser.is_verified) {
        await SendOtpForEmailVerification(existingUser);
        return res.status(200).json({
          success: true,
          message: "Otp sent to your email",
        });
      }
    } else {
      if (!existingUser.is_verified) {
        const currentTime = new Date();
        const otpExpirationTime = new Date(
          existingUserInOtpDB.createdAt.getTime() + 5 * 60 * 1000
        );
        if (currentTime > otpExpirationTime) {
          throw new Error("OTP Expired, Try Resending OTP");
        } else {
          return res.status(200).json({
            success: true,
            message: "OTP already sent to your email",
          });
        }
      }
    }
  } catch (error) {
    const message = errorHandler(error) || "Internal server error";
    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const resendEmailVerificationLinkController = async (req, res) => {
  /*
  >check is verified
  >check if exist 
    >if exist and generated in last 30 seconds then cant send new otp
    >if exist and not generated in last 30 seconds then can send new otp
  */
  try {
    let email = req.cookies.session_same;
    if (!email) {
      throw new Error("Invalid entry - Please enter email again");
    }
    const data = await UserModel.aggregate([
      {
        $match: {
          email: email,
        },
      },
      {
        $lookup: {
          from: "otps",
          localField: "_id",
          foreignField: "userId",
          as: "jd",
        },
      },
      {
        $addFields: {
          joinedData: { $arrayElemAt: ["$jd", 0] },
        },
      },
      {
        $project: {
          is_verified: "$is_verified",
          jd: "$joinedData",
          _id: "$_id",
          email: "$email",
        },
      },
    ]);

    const isVerified = data[0].is_verified;
    const otpData = data[0].jd || null;
    const userData = { _id: data[0]._id, email: data[0]?.email };
    if (isVerified) {
      throw new Error("Account already verified - Please Login");
    }
    if (!Boolean(otpData)) {
      await SendOtpForEmailVerification(userData);
      return res.status(200).json({
        success: true,
        message: "OTP Sent to your email",
      });
    }
    const currentTime = Date.now();
    const thirtySecondsAfterOtpCreation =
      otpData.createdAt.getTime() + 30 * 1000;
    if (currentTime < thirtySecondsAfterOtpCreation) {
      throw new Error("Please wait for 30 second before requesting new OTP");
    }

    await SendOtpForEmailVerification(userData);
    return res.status(200).json({
      success: true,
      message: "OTP Sent to your email",
    });
  } catch (error) {
    const message = errorHandler(error) || "Internal server error";
    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const verifyEmailWithOtpController = async (req, res) => {
  try {
    let { otp } = req.body;
    otp = parseInt(otp);
    if (!otp) {
      throw new Error("Please enter otp");
    }
    const cookie_email = req.cookies.session_same;
    if (!cookie_email) {
      const error = new Error("Invalid entry - Please verify email again");
      error.emailVerify = true;
      throw error;
    }
    const data = await UserModel.aggregate([
      {
        $match: {
          email: cookie_email,
        },
      },
      {
        $lookup: {
          from: "otps",
          localField: "_id",
          foreignField: "userId",
          as: "jd",
        },
      },
      {
        $addFields: {
          joinedData: { $arrayElemAt: ["$jd", 0] },
        },
      },
      {
        $project: {
          is_verified: "$is_verified",
          jd: "$joinedData",
          _id: "$_id",
          email: "$email",
        },
      },
    ]);
    const isVerified = data[0].is_verified;
    const otpData = data[0].jd || null;
    const userData = { _id: data[0]._id, email: data[0]?.email };

    if (isVerified) {
      throw new Error("Account already verified - Please Login");
    }

    if (!Boolean(otpData)) {
      await SendOtpForEmailVerification(userData);
      throw new Error("No OTP Found , New OTP Sent to your email");
    }
    if (otp !== otpData.otp) {
      throw new Error("Invalid OTP");
    }

    await UserModel.findByIdAndUpdate(userData?._id, {
      $set: { is_verified: true },
    });
    await OtpModel.findByIdAndDelete(otpData._id);
    return res.status(200).json({
      success: true,
      message: "Email Verified successfully, Please Login",
    });
  } catch (error) {
    const customFields = {};
    for (let key in error) {
      if (error.hasOwnProperty(key)) {
        customFields[key] = error[key];
      }
    }
    const message = errorHandler(error) || "Internal server error";
    return res.status(400).json({
      success: false,
      message,
      ...customFields,
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;
    if (!email || !password || !confirm_password) {
      throw new Error("All fields are required");
    }
    if (password.trim() !== confirm_password.trim()) {
      throw new Error("Password didn't match");
    }
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      throw new Error("No such email found");
    }
    if (!userExist.is_verified) {
      throw new Error("Account not verified, Please verify");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials");
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
    req.cookies.session_same && res.clearCookie("session_same");
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
    const message = errorHandler(error) || "Internal server error";
    return res.status(400).json({
      success: false,
      message,
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
      throw new Error("All fields are required");
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
      throw new Error("Invalid entry");
    }
    const isOldPassValid = await bcrypt.compare(
      old_password,
      userData[0].user_password
    );
    if (!isOldPassValid) {
      throw new Error("Invalid Credentials");
    }
    if (new_password.trim() !== confirm_password.trim()) {
      throw new Error("Password didn't match");
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
    const message = errorHandler(error) || "Internal server error";
    return res.status(400).json({
      success: false,
      message,
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
      throw new Error("All fields are required");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("No such email found");
    }
    const secret = user._id + process.env.ACCESS_TOKEN;
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "15m",
    });
    const resetPassLink = `${process.env.FRONTEND_HOST}/auth/reset-password/${user._id}/${token}`;
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
    const message = errorHandler(error) || "Internal server error";
    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password, confirm_password } = req.body;
    if (!password || !confirm_password) {
      throw new Error("All fields are required");
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("No such user found");
    }
    const secret = user._id + process.env.ACCESS_TOKEN;
    jwt.verify(token, secret);

    if (password.trim() !== confirm_password.trim()) {
      throw new Error("Password didn't match");
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
    const message = errorHandler(error) || "Internal server error";
    let errorMessage;

    if (error.name === "TokenExpiredError") {
      errorMessage = "Token Expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid link";
    } else {
      errorMessage = "Unable to reset password, please try again";
    }
    console.log(errorMessage);

    return res.status(400).json({
      success: false,
      message: message || errorMessage,
    });
  }
};
