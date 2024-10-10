import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middlewares/index.js";
import corsOptions from "./config/cors-options.js";
import {
  deptRoutes,
  authRoutes,
  roleRoutes,
  permissionRoutes,
  userRoutes,
  documentRoutes,
  attendanceRoutes,
} from "./routes/index.js";

const app = express();

//Used for parsing Request Bodies
app.use(express.json());
app.use(cors(corsOptions));
//Used for parsing cookies
app.use(cookieParser());

app.use("/api/dept", deptRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/attendance", attendanceRoutes);
//Health check route
app.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

//express default error handling middleware
app.use(errorHandler);

export default app;
