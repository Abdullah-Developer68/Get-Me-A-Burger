import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
export const runtime = "nodejs";

// After OTP verification the data is taken and the user status is turned active from verifying
export async function POST(request) {
  await dbConnect();
  const { email, name, password } = await request.json();
  if (!email || !password)
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );

  const user = await User.findOne({ email });

  if (user.status !== "verifying") {
    return NextResponse.json(
      { message: "User account is already active!" },
      { status: 200 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    name: name || "pending",
    username: "pending",
    status: "active",
    password: hashedPassword,
    username: email.split("@")[0],
  });
  return NextResponse.json({ message: "Sign up process has been completed!" });
}
