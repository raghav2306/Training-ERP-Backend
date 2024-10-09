import { CustomError } from "../utils/index.js";
import { uploadToS3 } from "../services/fileUpload.service.js";

import { User } from "../models/index.js";

export const uploadDocument = async (req, res, next) => {
  const { file } = req;
  const { name } = req.body;
  const userId = req.user._id;

  if (!file || !name) {
    throw new CustomError("Please fill all the fields.", 400);
  }

  const result = await uploadToS3(
    file.buffer,
    file.mimetype,
    file.originalname
  );

  await User.updateOne(
    { _id: userId },
    { $push: { documents: { name: name, value: result.Location } } }
  );

  res.status(200).json({ message: "document uploaded successfully." });
};
