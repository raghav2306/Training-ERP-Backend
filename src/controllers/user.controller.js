import mongoose from "mongoose";
import { User } from "../models/index.js";

export const getUsers = async (req, res) => {
  //pagination
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;
  //Filter
  const { deptId } = req.query;

  const offset = limit * (page - 1);

  let query = { _id: { $ne: req.user._id } };

  if (deptId) {
    query = { ...query, deptId: new mongoose.Types.ObjectId(deptId) };
  }

  const users = await User.find(query)
    .populate({
      path: "role",
      select: "name",
    })
    .populate({
      path: "deptId",
      select: "name managerId",
      populate: { path: "managerId", select: "name email" },
    })
    .select("-updatedAt -password")
    .limit(limit)
    .skip(offset);

  const userCount = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    totalUsers: userCount,
    totalPages: Math.ceil(userCount / limit),
  });
};
