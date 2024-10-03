import { Schema, Model } from "mongoose";

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

export const StatusUpdate = Model("StatusUpdate", statusUpdateSchema);
