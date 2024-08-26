import { Router } from "express";
import { verifyJWT, catchAsync } from "../middlewares/index.js";
import { getUsers } from "../controllers/index.js";

export const userRoutes = Router();

userRoutes.get("/", verifyJWT, catchAsync(getUsers));
