import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  Ref,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import { User } from "./user.model";

interface ColorObj {
  id: string;
  name: string;
  code: string;
}

interface IconObj {
  id: string;
  name: string;
  symbol: string;
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
export class Category {
  @prop({ required: true })
  name: string;

  @prop({ required: true, default: true })
  isEditable: boolean;

  @prop()
  color: ColorObj;

  @prop()
  icon: IconObj;

  @prop({ required: true, ref: () => User })
  userId: Ref<User>;
}

const CategoryModel = getModelForClass(Category);

export default CategoryModel;
