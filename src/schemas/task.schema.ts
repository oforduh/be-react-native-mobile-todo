import { z } from "zod";
import validator from "validator";
// import { Gender } from "../models/people.model";

const createTask = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "first name must be a string",
      })
      .min(1, { message: "Name be contain at least 1 character(s)" }),
    isCompleted: z
      .boolean({
        invalid_type_error: "isEditable must be a boolean",
      })
      .default(false),
    isEditable: z
      .boolean({
        invalid_type_error: "isEditable must be a boolean",
      })
      .default(true)
      .optional(),
    date: z
      .string({
        invalid_type_error: "Date must be a string",
      })
      .min(1, { message: "Date must contain at least 1 character(s)" }),
    categoryId: z
      .string({
        invalid_type_error: "category id must be a string",
      })
      .min(1, { message: "you must add a category" }),
  }),
});
const editTaskDetails = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "first name must be a string",
      })
      .optional(),
    isCompleted: z
      .boolean({
        invalid_type_error: "isEditable must be a boolean",
      })
      .default(false)
      .optional(),
    isEditable: z
      .boolean({
        invalid_type_error: "isEditable must be a boolean",
      })
      .default(true)
      .optional(),
    date: z
      .string({
        invalid_type_error: "Date must be a string",
      })
      .optional(),
  }),
});

export default {
  createTask,
  editTaskDetails,
};
