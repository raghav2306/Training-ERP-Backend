import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generate } from "generate-password";
import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";
import { sendLoginCredentials } from "../services/sendEmail.js";

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const checkPassword = async (password, actualPassword) => {
  const isMatched = await bcrypt.compare(password, actualPassword);

  if (!isMatched) {
    throw new CustomError("Your Password is incorrect", 401);
  }
  return true;
};

const createAdmin = async (email, password) => {
  // a) Role create -> Admin,
  const role = await Role.create({ name: "admin" });
  // b) Management dept create
  const dept = await Department.create({ name: "Management" });
  // c) Hash the password
  const hashedPassword = await hashPassword(password);
  // d) Fetch Admin permission
  const permissions = await Permission.find({
    name: "Administrator Access",
  }).select("_id");
  // e) Admin User Create,
  const user = await User.create({
    email,
    password: hashedPassword,
    role: role._id,
    deptId: dept._id,
    userPermissions: permissions,
  });

  return user;
};

const checkEmail = async (email) => {
  return await User.findOne({ email })
    .populate({
      path: "role",
      select: "name _id",
    })
    .populate({ path: "deptId", select: "name _id" })
    .populate({ path: "userPermissions", select: "name _id" });
};

const passwordGenerator = () => {
  return generate({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilarCharacters: true,
  });
};

const generateAccessToken = (userId) => {
  //require('crypto').randomBytes(64).toString('hex')
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "24h",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "7d",
  });
};

const verifyRefreshToken = (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    return decodedToken;
  } catch (err) {
    throw new CustomError("Session Expired.", 403);
  }
};

//for adding user/employee
export const registerUser = async (req, res) => {
  const { email, role, deptId } = req.body;

  if (!email) {
    throw new CustomError("Please fill all the fields.", 400);
  }

  //1) Check whether the email already exists or not
  const isUserExist = await checkEmail(email);

  if (isUserExist) {
    throw new CustomError("User with this email already exists.", 409);
  }

  //2) Password generate
  const password = passwordGenerator();
  console.log(password);

  //3) Password Hash
  const hashedPassword = await hashPassword(password);

  //4) Db Insert
  const user = new User();
  user.email = email;
  user.password = hashedPassword;
  user.role = role;
  user.deptId = deptId;

  const result = await user.save();

  //5) Mail -> email, password
  await sendLoginCredentials(email, req.body?.name || email, password);

  res.status(201).json({
    success: true,
    message: "User Created Successfully.",
    user: result,
  });
};

//for login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please fill all the fields", 400);
  }

  //1) Check whether any user exists or not
  const existingUser = await User.find();

  if (existingUser.length === 0) {
    const user = await createAdmin(email, password);

    if (user) {
      return res
        .status(201)
        .json({ success: true, message: "Admin Created Successfully", user });
    }
  }

  //2) Check whether the email exists or not
  const user = await checkEmail(email);

  if (!user) {
    throw new CustomError(
      "Your account does exist with us.",
      401,
      "Email Error"
    );
  }

  //3) Check Password
  await checkPassword(password, user.password);

  //4) Generate Access Token and Refresh Token
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const userObj = {
    userId: user._id,
    name: user?.name,
    email: user.email,
    role: user.role,
    department: user.deptId,
    userPermissions: user.userPermissions,
  };

  res.cookie("jwt", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    //secure: true,
    //sameSite: "none",
    //domain: ".abc.com",
  });

  res.status(200).json({
    success: true,
    message: "Login Successfully.",
    accessToken,
    user: userObj,
  });
};

//for generating new access token
export const getNewAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) {
    throw new CustomError("Session Expired", 403);
  }

  const decodedToken = verifyRefreshToken(refreshToken);

  const accessToken = generateAccessToken(decodedToken.userId);

  const user = await User.findById(decodedToken.userId);

  const userObj = {
    userId: user._id,
    name: user?.name,
    email: user.email,
    role: user.role,
    department: user.deptId,
    userPermissions: user.userPermissions,
  };

  res.status(200).json({ accessToken, user: userObj });
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    //secure: true,
    //sameSite: "none",
    //domain: ".abc.com",
  });

  res.status(204).end();
};
