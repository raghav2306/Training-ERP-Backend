import { Router } from "express";
import { uploadDocument, getDocuments } from "../controllers/index.js";
import { catchAsync, verifyJWT, upload } from "../middlewares/index.js";

export const documentRoutes = Router();

documentRoutes.get("/", verifyJWT, catchAsync(getDocuments));

documentRoutes.post(
  "/upload",
  verifyJWT,
  upload.single("file"),
  catchAsync(uploadDocument)
);
