import { getModelForClass } from "@typegoose/typegoose";

import { Task } from "./task.model";
import { Token } from "./token.model";
import { User } from "./user.model";
import { Category } from "./category.model";

export const UserModel = getModelForClass(User);
export const TokenModel = getModelForClass(Token);
export const TaskModel = getModelForClass(Task);
export const CategoryModel = getModelForClass(Category);
