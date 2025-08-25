import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
export const runtime = "nodejs";

// After OTP verification, finalize signup by setting password and activating the existing user
export async function POST(request) {
  await dbConnect();
  const { email, name, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "User not found. Please request a new OTP." },
      { status: 404 }
    );
  }

  if (user.status !== "verifying") {
    return NextResponse.json(
      { message: "User account is already active!" },
      { status: 200 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.status = "active";
  user.username =
    user.username && user.username !== "pending"
      ? user.username
      : email.split("@")[0];
  user.name = name || user.name || "";
  user.otp = undefined;
  await user.save();

  return NextResponse.json({ message: "Sign up process has been completed!" });
}
