import { CustomError } from "../utils/index.js";
import { Permission } from "../models/index.js";
import XLSX from "xlsx";

export const addPermission = async (req, res) => {
  const { file } = req;

  if (!file) {
    throw new CustomError("Please upload an Excel file", 400);
  }

  // Read and parse the Excel file
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[1]; // Get the first sheet
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Check if there are entries in the file
  if (!worksheet || worksheet.length === 0) {
    throw new CustomError("The Excel file is empty", 400);
  }

  // Extract the relevant data from each row
  const permissions = worksheet.map((row) => {
    const { permissionId, name, description } = row;
    // Ensure required fields are present
    if (!permissionId || !name) {
      throw new CustomError("Missing required fields in one or more rows", 400);
    }

    return { permissionId, name, description };
  });

  // Insert permissions into the database
  const result = await Permission.insertMany(permissions);

  res.status(201).json({
    success: true,
    message: "Permissions added successfully.",
    result,
  });
};

export const getPermission = async (req, res) => {
  const permissions = await Permission.find();

  res.status(200).json({ success: true, data: permissions });
};
