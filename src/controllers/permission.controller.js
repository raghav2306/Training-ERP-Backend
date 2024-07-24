import { CustomError } from "../utils/index.js";
import { Permission } from "../models/index.js";

export const addPermission = async (req, res) => {
  const { permissions } = req.body;

  if (!permissions || permissions.length === 0) {
    throw new CustomError("Please add atleast one permission", 400);
  }

  const result = await Permission.insertMany(permissions);

  res.status(201).json({
    success: true,
    message: "Permissions added successfully.",
    result,
  });
};
