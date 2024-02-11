import { badRequest, notFound, successfulRequest } from "../helpers/responses";
import CategoryModel from "../models/category.model";
import { Request, Response } from "express";
import { applyPagination } from "../utils/pagination";
// import { mongoose } from "@typegoose/typegoose";
import TaskModel from "../models/task.model";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
import mongoose, { ClientSession } from "mongoose";

const fetchTasks = async (req: Request, res: Response) => {
  const { _id } = req.user!;

  const total = await TaskModel.find({ userId: _id }).countDocuments();

  try {
    const { skip, limit, pages, sort, page } = applyPagination(
      req.query,
      total
    );

    const user = await TaskModel.find({ userId: _id }).populate([
      {
        path: "userId",
        select: "-id",
      },
      {
        path: "categoryId",
        select: "-id",
      },
    ]);

    successfulRequest({
      res,
      message: "Fetched all categories",
      data: user,
      totalDocuments: total,

      // meta: { total_users: total, pages, page },
    });
  } catch (error) {
    throw error;
  }
};
const fetchTasksByCategory = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const { categoryId } = req.params;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryId);

    if (!isValidObjectId)
      return badRequest({
        res,
        message: "invalid id format for category ",
      });

    const checkIDexistense = await CategoryModel.findById({ _id: categoryId });

    if (!checkIDexistense)
      return badRequest({
        res,
        message: "This Category does not exist in our app ",
      });

    const total = await TaskModel.find({
      userId: _id,
      categoryId,
    }).countDocuments();
    const user = await TaskModel.find({ userId: _id, categoryId }).populate([
      {
        path: "userId",
        select: "-id",
      },
      {
        path: "categoryId",
        select: "-id",
      },
    ]);

    successfulRequest({
      res,
      message: "Fetched all categories",
      data: user,
      totalDocuments: total,

      // meta: { total_users: total, pages, page },
    });
  } catch (error) {
    throw error;
  }
};

const fetchTasksForToday = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const currentDate = new Date();
  const [date] = dayjs(currentDate).format("L LT").split(" ");

  const total = await TaskModel.find({
    userId: _id,
    date,
  }).countDocuments();

  try {
    const user = await TaskModel.find({
      userId: _id,
      date,
    }).populate([
      {
        path: "userId",
        select: "-id",
      },
      {
        path: "categoryId",
        select: "-id",
      },
    ]);

    successfulRequest({
      res,
      message: "Fetched all categories",
      data: user,
      totalDocuments: total,

      // meta: { total_users: total, pages, page },
    });
  } catch (error) {
    throw error;
  }
};
const fetchCompletedTasks = async (req: Request, res: Response) => {
  const { _id } = req.user!;

  const total = await TaskModel.find({
    userId: _id,
    isCompleted: true,
  }).countDocuments();

  try {
    const user = await TaskModel.find({
      userId: _id,
      isCompleted: true,
    }).populate([
      {
        path: "userId",
        select: "-id",
      },
      {
        path: "categoryId",
        select: "-id",
      },
    ]);

    successfulRequest({
      res,
      message: "Fetched all categories",
      data: user,
      totalDocuments: total,

      // meta: { total_users: total, pages, page },
    });
  } catch (error) {
    throw error;
  }
};

const createTask = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const { categoryId } = req.body;

  const session: ClientSession = await mongoose.startSession();

  try {
    session.startTransaction();
    const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryId);

    if (!isValidObjectId)
      return badRequest({
        res,
        message: "invalid id format for category ",
      });

    const checkIDexistense = await CategoryModel.findById({
      _id: categoryId,
    }).session(session);

    if (!checkIDexistense)
      return badRequest({
        res,
        message: "This Category does not exist in our app ",
      });

    // await session.commitTransaction();

    const [category] = await TaskModel.create(
      [
        {
          ...req.body,
          userId: _id,
        },
      ],
      { session }
    );
    await category.populate([
      {
        path: "userId",
        select: "-_id",
      },
      {
        path: "categoryId",
        select: "-_id",
      },
    ]);

    await session.commitTransaction();
    successfulRequest({
      res,
      message: "Category created",
      data: category,
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

const editTask = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const { taskID } = req.params;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(taskID);

    if (!isValidObjectId)
      return badRequest({
        res,
        message: "invalid params format",
      });

    const taskDetails = await TaskModel.findOneAndUpdate(
      { _id: taskID, userId: _id },
      { ...req.body },
      { new: true }
    );

    if (!taskDetails)
      return notFound({
        res,
        message: "category details is not found",
      });

    await taskDetails.populate({ path: "userId" });

    successfulRequest({
      res,
      message: `task details with id ${taskID} status has been toggled`,
      data: taskDetails,
    });
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const { taskID } = req.params;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(taskID);

    if (!isValidObjectId)
      return badRequest({
        res,
        message: "invalid params format",
      });

    const deleteCategory = await TaskModel.findByIdAndDelete({
      _id: taskID,
      userId: _id,
    });

    successfulRequest({
      res,
      message: `Category with ${taskID} has been deleted`,
    });
  } catch (error) {
    throw error;
  }
};

// write an api to fetch todays task
export default {
  fetchTasks,
  createTask,
  fetchTasksByCategory,
  editTask,
  fetchCompletedTasks,
  fetchTasksForToday,
  deleteTask,
};
