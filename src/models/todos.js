import { Schema, model } from "mongoose";

const todosSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },
    deadLine: {
      type: Date,
      required: false,
    },
    assignedBy: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: [
      {
        type: Schema.ObjectId,
        required: true,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Todo = model("Todo", todosSchema);

