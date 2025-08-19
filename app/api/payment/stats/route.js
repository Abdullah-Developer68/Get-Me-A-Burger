import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Payment from "@/models/Payment";

// GET /api/payment/stats?username=<creator>&top=5
export async function GET(request) {
  await dbConnect();

  const url = request?.nextUrl || new URL(request.url);
  const username = url.searchParams.get("username");
  const topParam = url.searchParams.get("top");
  const top = Math.max(
    1,
    Math.min(20, Number.parseInt(topParam || "5", 10) || 5)
  );

  if (!username) {
    return NextResponse.json(
      { error: "username is required" },
      { status: 400 }
    );
  }

  try {
    // Summary stats
    //.aggregate() is a powerful method that processes and transforms data in stages (called the aggregation pipeline).
    const [summary] = await Payment.aggregate([
      // stage 1 -> Filter
      { $match: { to_user: username } },
      // stage 2 -> Group by (like in sql)
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          lastPaymentAt: { $max: "$createdAt" },
          supportersSet: { $addToSet: "$name" },
        },
      },
      // stage 3 -> Selects and shapes fields in return
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          count: 1,
          lastPaymentAt: 1,
          uniqueSupporters: { $size: "$supportersSet" },
          averageAmount: {
            $cond: [
              { $gt: ["$count", 0] },
              { $divide: ["$totalAmount", "$count"] },
              0,
            ],
          },
        },
      },
    ]);

    // Top supporters by total donated amount
    const topSupporters = await Payment.aggregate([
      { $match: { to_user: username } },
      {
        $group: {
          _id: "$name",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          lastPaymentAt: { $max: "$createdAt" },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: top },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalAmount: 1,
          count: 1,
          lastPaymentAt: 1,
        },
      },
    ]);

    return NextResponse.json({
      username,
      totalAmount: summary?.totalAmount || 0,
      count: summary?.count || 0,
      lastPaymentAt: summary?.lastPaymentAt || null,
      uniqueSupporters: summary?.uniqueSupporters || 0,
      averageAmount: summary?.averageAmount || 0,
      topSupporters,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
