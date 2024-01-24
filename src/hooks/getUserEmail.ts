import { Request, Response } from "express";

import UserModel from "../models/user.model";
import { successfulRequest } from "../helpers/responses";
import { BadRequestError } from "../errors/bad-request-error";

export const getUserEmail = async (req: Request, res: Response) => {
  const { userId } = req.query;

  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new BadRequestError("User not found");

    return successfulRequest({
      res,
      message: "Fetched User Email",
      data: user.email,
    });
  } catch (error) {
    throw error;
  }
};

export const fetchUser = async (req: Request, res: Response) => {
	const { userId } = req.query;

	try {
		const user = await UserModel.findOne({ _id: userId });

		if (!user) throw new BadRequestError("User not found");

		successfulRequest({
			res,
			message: "Fetched Successfully",
			data: user,
		});
	} catch (error) {
		throw error;
	}
};

export default {
	getUserEmail,
	fetchUser,
};

