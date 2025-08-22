import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ message: "Email and Password is required!" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({
      message: "Your account does not exist. Please try again!",
    });
  }
}
