import { Schema, model } from "mongoose";

const statusUpdateSchema = new Schema({
  date: {
    type: Date,
  },
  record: [
    {
      employeeId: {
        type: Schema.ObjectId,
        ref: "User",
      },
      status: String,
      uploadTime: Date,
    },
  ],
});

export const StatusUpdate = model("StatusUpdate", statusUpdateSchema);
