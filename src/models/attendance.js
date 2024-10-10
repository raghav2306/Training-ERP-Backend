import { Schema, model } from "mongoose";
import { ATTENDANCE_STATUS } from "../enums/index.js";

const attendanceSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  record: [
    {
      employeeId: { type: Schema.ObjectId, ref: "User" },
      checkInTime: String,
      checkOutTime: String,
      status: {
        type: String,
        enum: Object.values(ATTENDANCE_STATUS),
      },
    },
  ],
});

export const Attendance = model("Attendance", attendanceSchema);
