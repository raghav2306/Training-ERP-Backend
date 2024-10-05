import { Router } from "express";
import { catchAsync, verifyJWT } from "../middlewares/index.js";
import {
  registerUser,
  login,
  getNewAccessToken,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/index.js";

export const authRoutes = Router();

authRoutes.post("/register", verifyJWT, catchAsync(registerUser));

authRoutes.post("/login", catchAsync(login));

authRoutes.get("/refresh", catchAsync(getNewAccessToken));

authRoutes.post("/logout", catchAsync(logout));

authRoutes.post("/forgot-password", catchAsync(forgotPassword));

authRoutes.post("/verify-otp", catchAsync(verifyOTP));

authRoutes.post("/reset-password", catchAsync(resetPassword));
