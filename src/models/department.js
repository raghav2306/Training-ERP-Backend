import { Schema, model } from "mongoose";

const deptSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    managerId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    isDeptDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = model("Department", deptSchema);
