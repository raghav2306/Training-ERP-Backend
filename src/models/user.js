import { Schema, model } from "mongoose";
import { ATTENDANCE_STATUS } from "../enums/index.js";
import { checkIn } from "../controllers/attendance.controller.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    contactNo: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Role",
    },
    deptId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Department",
    },
    userPermissions: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Permission",
      },
    ],
    aadharCardNo: {
      type: Number,
      required: false,
    },
    panNo: {
      type: String,
      required: false,
    },
    userPic: {
      type: String,
      required: false,
    },
    documents: [
      {
        name: String,
        value: String,
      },
    ],
    totalLeaves: {
      type: Number,
      default: 12,
    },
    attendenceEditRequests: [
      {
        date: Date,
        checkIn: String,
        checkOut: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
    leavesRequested: [
      {
        from: Date,
        to: Date,
        leaveType: { type: String, enum: Object.values(ATTENDANCE_STATUS) },
        remarks: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
    otpVerification: {
      otp: String,
      otpExpiry: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
