import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const courseId = (await params).courseId;

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    // check if already purchased or not
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (purchase) {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "Already purchased this course",
        data: [],
      });
    }

    if (!course) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "Course not found",
        data: [],
      });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await prisma.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
      metadata: {
        courseId,
        userId: user.id,
      },
    });

    return NextResponse.json({url: session.url});
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
