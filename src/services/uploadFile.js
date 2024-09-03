import { v2 as cloudinary } from "cloudinary";
import { CustomError } from "../utils/index.js";
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadImage = async (base64String) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "ERP", // optional
      // transformation: [
      //   { width: 500, height: 500, crop: "auto", gravity: "auto" }, // Auto-crop to square aspect ratio
      //   { fetch_format: "auto", quality: "auto" }, // Use auto format and auto quality for optimization
      // ],
    });
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new CustomError("Internal Server Error", 500);
  }
};

export const uploadMultipleImages = async (base64Images) => {
  const uploadPromises = base64Images.map((base64Image) =>
    uploadImage(base64Image)
  );
  const results = await Promise.all(uploadPromises);
  return results.map((result) => result.secure_url);
};
