import { Role } from "../models/index.js";
import { CustomError } from "../utils/index.js";

export const createRole = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Please provide role name", 400);
  }

  const role = await Role.create({ name });

  res.status(201).json({
    success: true,
    message: "Role created successfully.",
    role,
  });
};

export const getRoles = async (req, res) => {
  const roles = await Role.find({ isRoleDeleted: false });

  res.status(200).json({ success: true, data: roles });
};

export const editRole = async (req, res) => {
  const { roleId } = req.params;
  const { name } = req.body;

  if (!roleId || !name) {
    throw new CustomError("Please fill all the fields", 400);
  }

  await Role.findByIdAndUpdate(roleId, { name });

  res.status(200).json({
    success: true,
    message: "Role updated successfully.",
  });
};

export const deleteRole = async (req, res) => {
  const { roleId } = req.params;

  if (!roleId) {
    throw new CustomError("Please fill all the fields", 400);
  }

  await Role.findByIdAndUpdate(roleId, { isRoleDeleted: true });

  res.status(200).json({
    success: true,
    message: "Role deleted successfully.",
  });
};
