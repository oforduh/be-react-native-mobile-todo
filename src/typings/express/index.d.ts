import { Jwt } from "jsonwebtoken";
import { User as UserType } from "../../models/user.model";

declare global {
  namespace Express {
    interface User extends UserType {
      _id: string;
    }

    interface Request {
      token: Jwt | string;
      rateLimit: RateLimit;
    }
  }
}
