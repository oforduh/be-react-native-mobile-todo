import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./user.model";
import { Category } from "./category.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Task {
  @prop({ required: true })
  name: string;

  @prop({ required: true, default: false })
  isCompleted: boolean;

  @prop({ required: false })
  date: Date;

  @prop({ required: true, ref: () => Category })
  categoryId: Ref<Category>;

  @prop({ required: true, ref: () => User })
  userId: Ref<User>;
}

const TaskModel = getModelForClass(Task);

export default TaskModel;
