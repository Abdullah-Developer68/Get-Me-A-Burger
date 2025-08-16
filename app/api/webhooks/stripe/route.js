import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { stripe } from "@/lib/stripe";
import Payment from "@/models/Payment";
import { unstable_after } from "next/server";

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

  // Acknowledge webhook immediately (tells stripe that data has
  // been received by the backend and avoids mongodb timeout issues
  // in serverless environment) this worked in express.js, but in Next.js
  // the code does not run after the response is returned and the return
  // keyword is compulsory to write in Next.js unlike in express where you could return a response
  // but still run the code in background
  // const acknowledgeResponse = NextResponse.json({ received: true });

  // To run this in the background like express we use background functions using unstable
  unstable_after(async () => {
    // Process DB operations after acknowledgment
    try {
      await dbConnect();

      // Handle events
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;

          // Persist donation/support in database (idempotent)
          try {
            // avoid duplicate records for the same Checkout Session
            const exists = await Payment.findOne({ oid: session.id });
            if (exists) break;

            const payment = {
              name: session.metadata?.supporter_name || "Someone",
              to_user: session.metadata?.username || "creator",
              oid: session.id,
              message:
                session.metadata?.supporter_message ||
                session.description ||
                "",
              // store amount in smallest currency unit (e.g. cents for USD)
              amount: Number(session.amount_total ?? 0),
            };

            await Payment.create(payment);
          } catch (dbErr) {
            // Log error but don't fail the webhook response
            console.error("DB operation failed:", dbErr);
          }

          break;
        }
        default:
          break;
      }
    } catch (dbErr) {
      // Log error but don't fail the webhook response
      console.error("DB operation failed:", dbErr);
    }
  });

  // if stripe receives this late due to cold start in vercel which causes timeout issues then use a background funtion in vercel
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
