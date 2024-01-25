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
    date: z.date(),
    categoryId: z
      .string({
        invalid_type_error: "category id must be a string",
      })
      .min(1, { message: "you must add a category" }),
  }),
});

export default {
  createTask,
};
