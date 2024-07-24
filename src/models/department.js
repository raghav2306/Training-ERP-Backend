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
    },
  },
  {
    timestamps: true,
  }
);

export const Department = model("Department", deptSchema);
