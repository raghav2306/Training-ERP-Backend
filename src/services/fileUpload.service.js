import { s3 } from "../config/aws-config.js";
import { v4 } from "uuid";
import path from "path";

const { AWS_S3_BUCKET_NAME } = process.env;

export const uploadToS3 = async (fileBuffer, fileType, fileName) => {
  const fileExtension = path.extname(fileName);

  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${v4()}${fileExtension}`, // S3 file name
    Body: fileBuffer,
    ContentType: fileType, // You can adjust the content type based on the file
  };

  return s3.upload(params).promise();
};
