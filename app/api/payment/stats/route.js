import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Payment from "@/models/Payment";

// GET /api/payment/stats?username=<creator>&top=5
export async function GET(request) {
  await dbConnect();

  const url = request?.nextUrl || new URL(request.url);
  const username = url.searchParams.get("username");
  const topParam = url.searchParams.get("top");

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
      // stage 1 -> Filter (SQL -> WHERE to_user = username )
      { $match: { to_user: username } },
      // stage 2 -> Group by (like in sql)
      {
        $group: {
          _id: null, // this means there is no need to create multiple unique groups for docs a single group is sufficient for all docs
          totalAmount: { $sum: "$amount" }, // sum's behaviour depending on value "$field" returns the total sum of the field's value in every document
          count: { $sum: 1 }, // sum -> 1 just returns the count of the docs.
          lastPaymentAt: { $max: "$createdAt" },
          supportersSet: { $addToSet: "$name" }, // Mongodb collects unique values of "name" field for all document and internally treat it
          // as a Set (data structure that has unique values only) but it returns a JSON array because MongoDB docs can not store actual sets
        },
      },
      // stage 3 -> Selects and shapes fields in return ( 0 is exclude and 1 is include it )
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          count: 1,
          lastPaymentAt: 1,
          uniqueSupporters: { $size: "$supportersSet" },
          averageAmount: {
            // conditional operator if (count > 0){ return <totalAmount> / <count>} -> then expression. else{ return 0 } else expression
            $cond: [
              { $gt: ["$count", 0] }, // -> condition
              { $divide: ["$totalAmount", "$count"] }, // -> then expression
              0, // -> else expression
            ],
          },
        },
      },
    ]);

    // Top supporters by total donated amount
    const topSupporters = await Payment.aggregate([
      // Stage 1 -> Filtering
      { $match: { to_user: username } },
      // Stage 2 -> grouping
      {
        $group: {
          // Mongodb groups docs by the $(field) and then there can be multiple groups of docs based on the
          // field and then the field's value is stored as a unique id for their respective group as well
          _id: "$name", // $name searches all docs with the same name
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          lastPaymentAt: { $max: "$createdAt" },
        },
      },
      // Stage 3 -> Sorting
      { $sort: { totalAmount: -1 } }, // Sort by totalAmount in descending order
      // Stage 4 -> Limiting
      { $limit: 3 },
      // Stage 5 -> Selecting specific values from a document project
      {
        $project: {
          _id: 0,
          name: "$_id", // among all the groups only 3 groups of top 3 people are left so get there _id (name)
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
