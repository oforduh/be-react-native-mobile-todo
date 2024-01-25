import { z } from "zod";
import validator from "validator";
// import { Gender } from "../models/people.model";

const createCategory = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "first name must be a string",
      })
      .min(1, { message: "Name be contain at least 1 character(s)" }),
    isEditable: z
      .boolean({
        invalid_type_error: "isEditable must be a boolean",
      })
      .default(true),
    color: z
      .object({
        id: z.string(),
        name: z.string(),
        code: z.string(),
      })
      .nullable()
      .optional(),
    icon: z
      .object({
        id: z.string(),
        name: z.string(),
        symbol: z.string(),
      })
      .nullable()
      .optional(),
  }),
});
const editCategory = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "first name must be a string",
      })
      .min(1, { message: "Name be contain at least 1 character(s)" })
      .optional(),
    isEditable: z
      .boolean({
        invalid_type_error: "isEditable must be a boolean",
      })
      .default(true)
      .optional(),
    color: z
      .object({
        id: z.string(),
        name: z.string(),
        code: z.string(),
      })
      .nullable()
      .optional(),
    icon: z
      .object({
        id: z.string(),
        name: z.string(),
        symbol: z.string(),
      })
      .nullable()
      .optional(),
  }),
});

export default {
  createCategory,
  editCategory,
};
