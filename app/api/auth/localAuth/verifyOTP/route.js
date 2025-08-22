import { NextResponse } from "next/server";
import User from "@/models/User";

// This is for verifying the OTP and after this the user can login
export async function POST(request) {
  const { email, otp } = await request.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "Please provide a valid email." });
  }

  if (otp !== user.otp) {
    return NextResponse.json({ message: "Invalid OTP." });
  }

  user.status = "active";
  await user.save();

  return NextResponse.json({ message: "OTP verified successfully." });
}
