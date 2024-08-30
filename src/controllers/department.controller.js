import { CustomError } from "../utils/index.js";
import { Department } from "../models/index.js";

export const createDept = async (req, res) => {
  const { name, managerId } = req.body;

  if (!name) {
    throw new CustomError("Please fill all the fields.", 400);
  }
  //MongoDB Transaction
  const department = await Department.create(req.body);

  await User.findByIdAndUpdate(managerId, { deptId: department._id });

  res.status(201).json({
    success: true,
    department,
    message: "Department created successfully.",
  });
};

export const getDepts = async (req, res) => {
  const departments = await Department.find({ isDeptDeleted: false });

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

  const existingDept = await Department.findById(deptId);

  if (!existingDept) {
    throw new CustomError("Department does not exist.", 400);
  }
  //MongoDB Transaction
  await Department.findByIdAndUpdate(deptId, req.body);

  await User.findByIdAndUpdate(managerId, { deptId });

  res
    .status(200)
    .json({ success: true, message: "Department updated successfully." });
};
