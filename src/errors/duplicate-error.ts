import { Response } from "express";
import { BAD_REQUEST } from "http-status";

import {
  DuplicateErrorException,
  DuplicateKey,
} from "../middlewares/errorHandler";

export const handleDuplicateError = (
  err: DuplicateErrorException,
  res: Response
) => {
  const keyPattern = err.keyPattern as DuplicateKey;

  const errorData = {
    errors: [
      {
        location: Object.keys(keyPattern)[0],
        reason: "duplicateKey",
        message: `${Object.keys(keyPattern)[0]} already exists`,
      },
    ],
    code: BAD_REQUEST,
    message: `${Object.keys(keyPattern)[0]} already exists`,
  };

  res.status(BAD_REQUEST).send({
    status: false,
    error: errorData,
  });
};
