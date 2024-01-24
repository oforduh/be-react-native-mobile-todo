import { z } from "zod";
import validator from "validator";

const register = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email must be a string" })
      .email({ message: "Invalid email" }),
    password: z.string({ required_error: "Password must be a string" }).refine(
      (value) => {
        // Regular expression to check if the password has symbols, uppercase, lowercase, and numbers
        const regex =
          /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).*(?=.*[A-Z]).*(?=.*[a-z]).*(?=.*\d).{8,}$/;

        return regex.test(value);
      },
      {
        message:
          "Invalid password format. Must contain symbols, uppercase, lowercase, and numbers.",
      }
    ),
    name: z.string({ required_error: "firstName must be a string" }).optional(),
  }),
});

const login = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email must be a string" })
      .email({ message: "Invalid email" }),
    password: z.string({ required_error: "Password must be a string" }),
  }),
});

export default {
  register,
  login,
};
