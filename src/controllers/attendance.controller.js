import { CustomError } from "../utils/index.js";
import { Attendance, User } from "../models/index.js";
import { ATTENDANCE_STATUS } from "../enums/index.js";

export const checkIn = async (req, res) => {
  const { checkInTime } = req.body;
  const userId = req.user._id;

  if (!checkInTime) {
    throw new CustomError("Please fill all the fields", 400);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingAttendance = await Attendance.findOne({ date: today });
  const record = {
    employeeId: userId,
    checkInTime,
    status: ATTENDANCE_STATUS.PRESENT,
  };

  if (!existingAttendance) {
    await Attendance.create({
      date: today,
      record: [record],
    });
  } else {
    await Attendance.updateOne({ date: today }, { $push: { record: record } });
  }

  res.status(200).json({ success: true, message: "Check In successfull." });
};

export const checkOut = async (req, res) => {
  const { checkOutTime } = req.body;
  const userId = req.user._id;

  if (!checkOutTime) {
    throw new CustomError("Please fill all the fields", 400);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingAttendance = await Attendance.findOne({
    date: today,
    "record.employeeId": userId,
  });

  let updatedRecord = existingAttendance.record;

  updatedRecord = updatedRecord.map((item) => {
    if (item.employeeId.toString() === userId.toString()) {
      return { ...item, checkOutTime };
    }
    return item;
  });

  existingAttendance.record = updatedRecord;

  await existingAttendance.save();

  res.status(200).json({ success: true, message: "Check out successfull" });
};

export const getAttendance = async (req, res) => {
  const { from, to } = req.query;
  const userId = req.user._id;

  if (!from || !to) {
    throw new CustomError("Please select the date range", 400);
  }

  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 59);

  const result = await Attendance.find({
    "record.employeeId": userId,
    $and: [{ date: { $gte: fromDate } }, { date: { $lte: toDate } }],
  }).lean();

  const updatedResult = result.map((item) => {
    const record = item.record.find(
      (rd) => rd.employeeId.toString() === userId.toString()
    );
    return { ...item, record };
  });

  res.status(200).json({ success: true, data: updatedResult });
};

export const applyLeave = async (req, res) => {
  const { from, to, leaveType, remarks } = req.body;
  const userId = req.user._id;

  if (!from || !to || !leaveType) {
    throw new CustomError("Please fill all the fields", 400);
  }

  const fromDate = new Date(from).setHours(0, 0, 0, 0);
  const toDate = new Date(to).setHours(23, 59, 59, 59);

  const result = await User.updateOne(
    { _id: userId },
    {
      $push: {
        leavesRequested: { from: fromDate, to: toDate, leaveType, remarks },
      },
    }
  );

  res.status(200).json({ success: true, message: "Leave request added." });
};

export const getAppliedLeaves = async (req, res) => {
  const userId = req.user._id;

  const result = await User.findById(userId).select("leavesRequested");

  res.status(200).json({ success: true, data: result });
};

export const viewLeaveRequests = async (req, res) => {
  const deptId = req.user.deptId;

  const leaveRequests = await User.find({
    deptId: deptId,
    "leavesRequested.status": "pending",
  }).select("email name leavesRequested");

  res.status(200).json({ success: true, data: leaveRequests });
};

export const leaveAction = async (req, res) => {
  const { userId, requestedLeaveId, action } = req.body;

  if (!userId || !requestedLeaveId || !action) {
    throw new CustomError("Please fill all the fields", 400);
  }

  const request = await User.findOne({
    _id: userId,
    "leavesRequested._id": requestedLeaveId,
    "leavesRequested.status": "pending",
  }).select("leavesRequested");

  if (!request) {
    throw new CustomError("The leave request does not exist.", 404);
  }

  if (action === "rejected") {
    await User.updateOne(
      { _id: userId, "leavesRequested._id": requestedLeaveId },
      { $set: { "leavesRequested.$.status": action } }
    );

    return res
      .status(200)
      .json({ success: true, message: `Leave request rejected` });
  }

  const leaveRequest = request.leavesRequested.find(
    (item) => item._id.toString() === requestedLeaveId
  );

  const fromDate = new Date(leaveRequest?.from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(leaveRequest?.to);
  toDate.setHours(0, 0, 0, 0);

  // Generate an array of dates from fromDate to toDate
  const dateRange = [];
  const currentDate = new Date(fromDate);
  while (currentDate <= toDate) {
    dateRange.push(new Date(currentDate)); // Clone the date to avoid reference issues
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Prepare bulk operations for Attendance model
  const bulkOps = dateRange.map((date) => {
    const filter = { date: date }; // Filter based on the date
    const update = {
      $push: { record: { employeeId: userId, status: leaveRequest.leaveType } },
    };
    const options = { upsert: true }; // Create new record if the date doesn't exist

    return {
      updateOne: {
        filter: filter,
        update: update,
        upsert: options.upsert,
      },
    };
  });

  const query1 = User.updateOne(
    { _id: userId, "leavesRequested._id": requestedLeaveId },
    { $set: { "leavesRequested.$.status": action } }
  );

  // Execute bulkWrite to handle all updates in a single operation
  const query2 = Attendance.bulkWrite(bulkOps);

  await Promise.all([query1, query2]);

  res.status(200).json({ success: true, message: `Leave request approved` });
};
