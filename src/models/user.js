import { Schema, model } from "mongoose";

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
      required: true,
      ref: "Role",
    },
    deptId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Department",
    },
    userPermissions: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Permission",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
