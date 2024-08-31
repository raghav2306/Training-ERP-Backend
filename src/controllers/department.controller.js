import { CustomError } from "../utils/index.js";
import { Department, User } from "../models/index.js";
import mongoose from "mongoose";

export const createDept = async (req, res) => {
  const { name, managerId } = req.body;

  if (!name) {
    throw new CustomError("Please fill all the fields.", 400);
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const department = await Department.create([{ name, managerId }], {
      session,
    });

    if (managerId) {
      await User.findByIdAndUpdate(
        managerId,
        { deptId: department._id },
        { session }
      );
    }
    await session.commitTransaction();
    res.status(201).json({
      success: true,
      department,
      message: "Department created successfully.",
    });
  } catch (err) {
    await session.abortTransaction();

    return res.status(500).json({ message: "Unable to create Department" });
  } finally {
    session.endSession();
  }
};

export const getDepts = async (req, res) => {
  const departments = await Department.find({ isDeptDeleted: false }).populate({
    path: "managerId",
    select: "name email",
  });

  res.status(200).json({
    success: true,
    data: departments,
  });
};

export const deleteDept = async (req, res) => {
  const { deptId } = req.params;

  const department = await Department.findById(deptId);

  if (!department) {
    throw new CustomError("Department does not exist", 400);
  }

  await Department.findByIdAndUpdate(deptId, {
    isDeptDeleted: true,
  });

  res
    .status(200)
    .json({ success: true, message: "Department deleted successfully." });
};

export const updateDept = async (req, res) => {
  const { deptId } = req.params;
  const { name, managerId } = req.body;

  if (!name || !deptId || !managerId) {
    throw new CustomError("Please fill all the fields.", 400);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const existingDept = await Department.findById(deptId, { session });

    if (!existingDept) {
      throw new CustomError("Department does not exist.", 400);
    }

    await Department.findByIdAndUpdate(deptId, req.body, { session });

    await User.findByIdAndUpdate(managerId, { deptId }, { session });

    await session.commitTransaction();

    res
      .status(200)
      .json({ success: true, message: "Department updated successfully." });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: "Unable to update department" });
  } finally {
    session.endSession();
  }
};
