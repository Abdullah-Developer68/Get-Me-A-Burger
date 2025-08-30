"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadUserInfoAction(formData) {
  const file = formData.get("file");

  if (!file) {
    throw new Error("No file found");
  }

  // Conver File -> Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary with upload_stream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "get-me-a-coke",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}
