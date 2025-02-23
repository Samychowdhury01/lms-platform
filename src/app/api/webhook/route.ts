import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log("[WEBHOOK_ERROR]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "Invalid user or course",
        data: [],
      });
    }

    await prisma.purchase.create({
      data: {
        userId,
        courseId,
      },
    });
  } else {
    return NextResponse.json({
      statusCode: 200,
      success: false,
      message: "Webhook Error: Unhandled event type",
      data: [],
    });
  }

  return new NextResponse(null, {status: 200})
}
