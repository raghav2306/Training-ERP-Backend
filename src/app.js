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
} from "./routes/index.js";

const app = express();

//Used for parsing Request Bodies
app.use(express.json());
app.use(cors(corsOptions));
//Used for parsing cookies
app.use(cookieParser());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use("/api/dept", deptRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/document", documentRoutes);
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
