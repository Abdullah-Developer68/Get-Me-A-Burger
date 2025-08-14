"use server";
import { stripe } from "../../lib/stripe";
import { NextResponse } from "next/server";

export const createCheckoutSession = async (request) => {
  try {
    const { amount, name, message, username } = await request.json();
    // validation
    if (!process.env.Stripe_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing Stripe secret key" },
        { status: 500 }
      );
    }

    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // setting up data
    const origin = request.nextUrl?.origin ?? "";

    const safeUsername =
      typeof username === "string" && username.length > 0
        ? username
        : "creator";
    const supporterName =
      typeof name === "string" && name.length > 0 ? name : "Someone";
    const supporterMessage =
      typeof message === "string" && message.length > 0 ? message : undefined;

    // creating Checkout Session
    const session = await stripe.checkout.session.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Support @${safeUsername}`,
              description: supporterMessage
                ? `${supporterName}:${supporterMessage}`
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
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
