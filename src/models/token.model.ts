import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  DocumentType,
  ReturnModelType,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./user.model";

export enum TokenType {
  AUTH_2FA = "2fa_auth",
  AUTH_REQUEST = "auth_request",
  RESEND_REQUEST = "resend_request",
  VERIFY_EMAIL = "verify_email",
  PASSWORD_RESET = "reset_password",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.updatedAt;
        delete ret.createdAt;
      },
      versionKey: false,
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Token {
  @prop({})
  email: string;

  @prop({ ref: () => User })
  userId: Ref<User>;

  @prop({ required: true })
  token: number | string;

  @prop({ required: true })
  type: TokenType;

  @prop({ required: true, default: true })
  valid: boolean;

  @prop({})
  expiresAt: string;
}

const TokenModel = getModelForClass(Token);

export default TokenModel;
