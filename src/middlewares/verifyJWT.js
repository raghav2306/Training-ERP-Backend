import jwt from "jsonwebtoken";
import { CustomError } from "../utils/index.js";
import { User } from "../models/index.js";

export const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    return next(new CustomError("You are not authenticated", 400));
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
  } catch (err) {
    return next(new CustomError("Session Expired", 403)); //forbidden
  }

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    return next(new CustomError("User not found", 401));
  }

  req.user = user;
  next();
};
