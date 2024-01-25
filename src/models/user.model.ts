import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  DocumentType,
  ReturnModelType,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import { sign } from "jsonwebtoken";
import log from "../services/logger.service";

const secret = process.env.JWT_SECRET;

class Token {
  @prop({ required: true })
  token: string;
}

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await argon2.hash(this.password);
  this.password = hash;

  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.tokens;
        delete ret.updatedAt;
        delete ret.createdAt;
        delete ret.password;
      },
      versionKey: false,
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ required: true, unique: true, lowercase: true })
  email: string;

  @prop({ lowercase: true })
  name: string;

  @prop({})
  tokens: Token[];

  @prop({ required: true })
  password: string;

  // check if the credentials already exist in the database using static method
  public static async findByCredentials(
    // the "this" definition is required to have the correct types
    this: ReturnModelType<typeof User>,
    email: string
  ) {
    // validation check for email
    const user = await this.findOne({
      email,
    });

    if (!user) return null;
    return user;
  }

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      throw error;
    }
  }

  // check if the credentials already exist in the database using static method
  async generateAuthToken(this: DocumentType<User>) {
    try {
      const token = sign(
        {
          _id: this._id,
          email: this.email,
        },
        secret!
      );

      this.tokens.push({ token });

      await this.save();

      return token;
    } catch (error) {
      throw error;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
