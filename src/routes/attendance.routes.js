import { Router } from "express";
import {
  checkIn,
  checkOut,
  getAttendance,
  applyLeave,
  getAppliedLeaves,
  viewLeaveRequests,
  leaveAction,
} from "../controllers/index.js";
import { catchAsync, verifyJWT } from "../middlewares/index.js";

export const attendanceRoutes = Router();

attendanceRoutes.post("/check-in", verifyJWT, catchAsync(checkIn));

attendanceRoutes.post("/check-out", verifyJWT, catchAsync(checkOut));

attendanceRoutes.get("/", verifyJWT, catchAsync(getAttendance));

attendanceRoutes.post("/apply-leave", verifyJWT, catchAsync(applyLeave));

attendanceRoutes.get(
  "/applied-leaves",
  verifyJWT,
  catchAsync(getAppliedLeaves)
);

attendanceRoutes.get(
  "/view-leave-requests",
  verifyJWT,
  catchAsync(viewLeaveRequests)
);

attendanceRoutes.post("/leave-action", verifyJWT, catchAsync(leaveAction));
