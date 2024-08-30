import { Router } from "express";
import { verifyJWT, catchAsync } from "../middlewares/index.js";
import { getUsers, getAvailableManagers } from "../controllers/index.js";

export const userRoutes = Router();

userRoutes.get("/", verifyJWT, catchAsync(getUsers));

userRoutes.get("/available-managers", verifyJWT, catchAsync(getAvailableManagers));
