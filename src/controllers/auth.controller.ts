import { Request, Response } from "express";
import parser from "ua-parser-js";
import UserModel, { User } from "../models/user.model";

import { successfulRequest, redirect, badRequest } from "../helpers/responses";
import { BadRequestError } from "../errors/bad-request-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";

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
};
