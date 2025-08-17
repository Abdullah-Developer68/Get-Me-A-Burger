import { stripe } from "@lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request) {
  // This api route is taking the required info for the donation and is creating a checkout session with Stripe
  try {
    const { amount, name, message, username } = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const origin = request.nextUrl?.origin ?? "";
    const safeUsername =
      typeof username === "string" && username.length > 0
        ? username
        : "creator";
    const supporterName =
      typeof name === "string" && name.length > 0 ? name : "Someone";
    const supporterMessage =
      typeof message === "string" && message.length > 0 ? message : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Support @${safeUsername}`,
              description: supporterMessage
                ? `${supporterName}: ${supporterMessage}`
                : undefined,
            },
            unit_amount: Math.round(Number(amount) * 100), // smallest currency unit
          },
          quantity: 1,
        },
      ],
      metadata: {
        username: safeUsername,
        supporter_name: supporterName,
        supporter_message: supporterMessage ?? "",
      },
      success_url: `${origin}/${safeUsername}?success=1`,
      cancel_url: `${origin}/${safeUsername}?canceled=1`,
    });

    // sends the url to the frontend for it to redirect
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
