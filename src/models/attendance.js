import { Schema, model } from "mongoose";

const attendanceSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  record: [
    {
      employeeId: { type: Schema.ObjectId, ref: "User" },
      checkInTime: Date,
      checkOutTime: Date,
      status: String,
    },
  ],
});

export const Attendance = model("Attendance", attendanceSchema);

