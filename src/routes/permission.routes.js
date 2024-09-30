import { Router } from "express";
import { catchAsync, upload, verifyJWT } from "../middlewares/index.js";
import { addPermission, getPermission } from "../controllers/index.js";

export const permissionRoutes = Router();

permissionRoutes.post(
  "/add-permission",
  upload.single("permissionFile"),
  catchAsync(addPermission)
);

permissionRoutes.get(
  "/",
  // verifyJWT,
  catchAsync(getPermission)
);
