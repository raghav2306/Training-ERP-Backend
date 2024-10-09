import { Router } from "express";
import { uploadDocument } from "../controllers/index.js";
import { catchAsync, verifyJWT, upload } from "../middlewares/index.js";

export const documentRoutes = Router();

documentRoutes.post(
  "/upload",
  verifyJWT,
  upload.single("file"),
  catchAsync(uploadDocument)
);
