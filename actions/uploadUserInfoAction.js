"use server";

import cloudinary from "@/lib/cloudinary";
import User from "@/models/User.js";

async function uploadToCloudinary(file, folder) {
  // Skip if no file or it isn't a File (can be null when user didn't select)
  if (!file || typeof file.arrayBuffer !== "function") return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function uploadUserInfoAction(formData) {
  // Text fields
  const name = formData.get("name")?.toString() || null;
  const email = formData.get("email")?.toString() || null;
  const username = formData.get("username")?.toString() || null;

  // Files
  const profileFile = formData.get("profile");
  const coverFile = formData.get("cover");

  const userExists = await User.findOne({ email });

  if (!email) {
    return {
      ok: false,
      error: "Email is required",
    };
  }

  if (!userExists) {
    return {
      ok: false,
      error: "User does not exist",
    };
  }

  // Upload in parallel (if provided)
  const [profileUpload, coverUpload] = await Promise.all([
    uploadToCloudinary(profileFile, "get-me-a-coke/profile"),
    uploadToCloudinary(coverFile, "get-me-a-coke/cover"),
  ]);

  // TODO: persist name/email/username and URLs to DB here (omitted)
  const updatedUser = await userExists.updateOne(
    {
      name,
      username,
      profileUrl: profileUpload?.secure_url || null,
      coverUrl: coverUpload?.secure_url || null,
    },
    { new: true }
  );
  return {
    ok: true,
    user: updatedUser,
  };
}
