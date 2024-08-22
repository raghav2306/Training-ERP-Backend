import { Router } from "express";
import { catchAsync, verifyJWT } from "../middlewares/index.js";
import {
  createRole,
  getRoles,
  editRole,
  deleteRole,
} from "../controllers/index.js";

export const roleRoutes = Router();

roleRoutes.post("/create-role", verifyJWT, catchAsync(createRole));

roleRoutes.get("/get-roles", verifyJWT, catchAsync(getRoles));

roleRoutes.patch("/edit-role/:roleId", verifyJWT, catchAsync(editRole));

roleRoutes.delete("/delete-role/:roleId", verifyJWT, catchAsync(deleteRole));
