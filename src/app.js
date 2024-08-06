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
} from "./routes/index.js";

const app = express();

//Used for parsing Request Bodies
app.use(express.json());
app.use(cors(corsOptions));
//Used for parsing cookies
app.use(cookieParser());

//For debugging (Only DEV Env.)
app.use((req, res, next) => {
  console.log(req.url);
  // console.log(req.headers);
  next();
});

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

//express default error handling middleware
app.use(errorHandler);

export default app;
