import { Request, Response } from "express";
import parser from "ua-parser-js";
import { User } from "../models/user.model";

import { successfulRequest, redirect, badRequest } from "../helpers/responses";
import { BadRequestError } from "../errors/bad-request-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import qrcode from "qrcode";
import { authenticator } from "@otplib/preset-default";
import { TokenType } from "../models/token.model";

import { TokenModel, UserModel } from "../models/index.model";
import log from "../services/logger.service";

const signUp = async (req: Request, res: Response) => {
  try {
    const newUser = await UserModel.create(req.body);
    const token = await newUser.generateAuthToken();

    newUser.save();

    successfulRequest({
      res,
      message: "Account created successfully",
      data: { newUser, token },
    });
  } catch (error: any) {
    throw error;
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findByCredentials(email);
    if (!user)
      return badRequest({
        message: "invalid login details",
        res,
      });

    const validatePassword = await user.validatePassword(password);

    if (!validatePassword)
      return badRequest({
        message: "invalid password details",
        res,
      });

    const getRQT = async (type: TokenType) => {
      return await user.generateRequestToken(type);
    };

    if (user.tfaEnabled) {
      return redirect({
        message: "Two factor authentication required",
        res,
        data: {
          user,
          authToken: await getRQT(TokenType.AUTH_2FA),
        },
      });
    }
    const token = await user.generateAuthToken();

    successfulRequest({
      res,
      message: "Account created successfully",
      data: { user, token },
    });
  } catch (error: any) {
    throw error;
  }
};

const loginWithAuthenticator = async (req: Request, res: Response) => {
  try {
    // Get remaining attempts from rateLimit
    const { remaining } = req.rateLimit;

    // Get user agent details
    const { ua } = parser(req.headers["user-agent"]);
    console.log(ua);
    const genericMsg = `Invalid authentication code, you have ${remaining} attempts left`;

    const { authToken, code } = req.body;

    // Find the token object
    // https://www.mongodb.com/docs/manual/reference/operator/query/lt/ docs
    const token = await TokenModel.findOne({
      token: authToken,
      type: TokenType.AUTH_2FA,
      valid: true,
      expiresAt: { $gt: Date.now() },
    });

    // Throw an error if the token is not found
    if (!token) throw new BadRequestError("Invalid or expired auth token");

    // Fetch user details using provided email
    const user = await UserModel.findById(token.userId);

    // Throw generic error if there's no user
    if (!user) throw new BadRequestError("user does not exist");

    // Verify the user's code
    const verified = authenticator.check(code, user.tfaSecret);

    // Throw an error message if the verification fails
    if (!verified) throw new BadRequestError("invalid authentication code");

    token.valid = false;
    await token.save();
    const generatedToken = await user.generateAuthToken();

    successfulRequest({
      res,
      message: "User Authenticated",
      data: { user, token: generatedToken },
    });
  } catch (error) {
    throw error;
  }
};

// GET Request Controllers
const currentUser = async (req: Request, res: Response) => {
  const { _id } = req.user!;

  try {
    const user = await UserModel.findById(_id);
    if (!user) throw new BadRequestError("User not found");

    successfulRequest({
      res,
      message: "Fetched current user",
      data: user,
    });
  } catch (error) {
    throw error;
  }
};
const logout = async (req: Request, res: Response) => {
  const token = req.token;
  const { _id } = req.user!;

  try {
    await UserModel.updateOne({ _id }, { $pull: { tokens: { token } } });

    successfulRequest({
      res,
      message: "User logged out",
      data: {},
    });
  } catch (error) {
    throw error;
  }
};

const generateQRCode = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user!;
    const user = await UserModel.findById(_id);
    if (!user)
      return badRequest({
        message: "User not found",
        res,
      });
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user?.email, "Todo App Auth", secret);
    const qr = await qrcode.toDataURL(otpauth);
    user.tfaTempSecret = secret;
    await user.save();
    successfulRequest({
      res,
      message: "Two factor authentication request was successfully",
      data: { secret, qr },
    });
  } catch (error: any) {
    throw error;
  }
};

const enable2FA = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user!;

    const { code } = req.body;
    const user = await UserModel.findById(_id);
    if (!user)
      return badRequest({
        message: "User not found",
        res,
      });

    const verified = authenticator.check(code, user?.tfaTempSecret);
    if (!verified)
      return badRequest({
        message: "Invalid auth code",
        res,
      });

    user.tfaEnabled = true;
    user.tfaSecret = user.tfaTempSecret;

    user.tfaTempSecret = "";
    await user.save();
    successfulRequest({
      res,
      message: "Two factor authentication is enabled",
      data: {},
    });
  } catch (error: any) {
    throw error;
  }
};

const getStatus = async (req: Request, res: Response) => {
  res.send("This is hitting status end point");
  // return successfulRequest({ res, message: "Api is functional" });
};

export default {
  signUp,
  login,
  currentUser,
  logout,
  getStatus,
  generateQRCode,
  enable2FA,
  loginWithAuthenticator,
};
