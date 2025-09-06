"use server";

import cloudinary from "@/lib/cloudinary";
import User from "@/models/User.js";
import dbConnect from "@/db/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function deleteCover(email, filePath) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  // Delete user from database
  const user = await User.findOne({ email });
  user.coverPic = "./coverPic.png"; // this is the default pic
  await user.save();

  // Delete user images from Cloudinary
  if (filePath) {
    await cloudinary.uploader.destroy(filePath);
  }
}
