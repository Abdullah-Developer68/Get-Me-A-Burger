import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Payment from "@/models/Payment";

// req for getting recent payments
export async function GET() {
  await dbConnect();

  // Get the 10 most recent payments
  const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(10);

  return NextResponse.json(recentPayments);
}
