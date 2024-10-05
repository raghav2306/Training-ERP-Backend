import { Schema, model } from "mongoose";
import { LEAVETYPE } from "../enums/index.js";

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
    leavesRequested: [
      {
        from: Date,
        to: Date,
        remarks: String,
        leaveType: { type: String, enum: Object.values(LEAVETYPE) },
        isApproved: Boolean,
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
