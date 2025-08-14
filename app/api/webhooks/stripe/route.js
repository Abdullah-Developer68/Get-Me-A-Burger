import Stripe from "stripe";
import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  const signature = request.headers.get("stripe-signature");

  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ ok: true });
  }

  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // TODO: persist donation/support in database
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

// exports keyword was required for the variable below to tell the Next.js compiler about them on run/build time and export default can't be used here

// This is a build-time directive for Next.js that tells it to run this route on Node runtime for stripe SDK and reliable raw-body handling)
export const runtime = "nodejs";
// Force dynamic rendering so this route runs fresh on every request.
// Stripe webhooks must process real-time payloads with exact signatures,
// so we disable static generation and caching to avoid stale responses.
// This is not needed in express.js because it does not pre build our routes before hand.
export const dynamic = "force-dynamic";

// This is different from dynamic routing. This is dynamic rendering this specifically applies to the rendering behavior of the route,
// ensuring that it always runs on the server and never gets cached.

// On the other hand dynamic routing is this [...Stripe]/route.js this allows to create URL parameters.
