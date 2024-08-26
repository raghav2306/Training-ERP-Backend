import { Router } from "express";
import {
  createDept,
  getDepts,
  deleteDept,
  updateDept,
} from "../controllers/index.js";
import { catchAsync, verifyJWT } from "../middlewares/index.js";

export const deptRoutes = Router();

deptRoutes.post("/create-dept", verifyJWT, catchAsync(createDept));

deptRoutes.get("/get-depts", verifyJWT, catchAsync(getDepts));

deptRoutes.delete("/delete-dept/:deptId", verifyJWT, catchAsync(deleteDept));

deptRoutes.put("/update-dept/:deptId", verifyJWT, catchAsync(updateDept));
