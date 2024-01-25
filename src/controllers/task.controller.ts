import { badRequest, notFound, successfulRequest } from "../helpers/responses";
import CategoryModel from "../models/category.model";
import { Request, Response } from "express";
import { applyPagination } from "../utils/pagination";
import { mongoose } from "@typegoose/typegoose";
import TaskModel from "../models/task.model";

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

const createTask = async (req: Request, res: Response) => {
  const { _id } = req.user!;

  try {
    const category = await TaskModel.create({
      ...req.body,
      userId: _id,
    });
    await category.populate([
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
      message: "Category created",
      data: category,
    });
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const { categoryID } = req.params;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryID);

    if (!isValidObjectId)
      return badRequest({
        res,
        message: "invalid params format",
      });

    const deleteCategory = await CategoryModel.findByIdAndDelete({
      _id: categoryID,
      userId: _id,
    });

    successfulRequest({
      res,
      message: `Category with ${categoryID} has been deleted`,
    });
  } catch (error) {
    throw error;
  }
};

const editCategory = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const { categoryID } = req.params;

  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(categoryID);

    if (!isValidObjectId)
      return badRequest({
        res,
        message: "invalid params format",
      });

    const categoryDetails = await CategoryModel.findOneAndUpdate(
      { _id: categoryID, userId: _id },
      { ...req.body },
      { new: true }
    );

    if (!categoryDetails)
      return notFound({
        res,
        message: "category details is not found",
      });

    await categoryDetails.populate({ path: "userId" });

    successfulRequest({
      res,
      message: `category details with id ${categoryID} updated successfully`,
      data: categoryDetails,
    });
  } catch (error) {
    throw error;
  }
};

export default {
  fetchTasks,
  createTask,
  deleteCategory,
  editCategory,
};
