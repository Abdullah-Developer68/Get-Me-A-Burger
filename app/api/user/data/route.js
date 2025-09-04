import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/db/dbConnect";

export const GET = async (request) => {
  const { username } = await request.json();
  try {
    await dbConnect();
    const user = await User.findOne({ username });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
