// app/api/admin/meals/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../lib/prisma";

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 }
      );
    }

    // Check authorization (admin only)
    if (session.user.role !== "ADMIN") {
      return Response.json(
        { error: "Forbidden: Only admins can create meals" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, type, date, imgURL, ingredients } = body;

    // Validate input
    if (!title || !type || !date) {
      return Response.json(
        { error: "Missing required fields: title, type, date" },
        { status: 400 }
      );
    }

    if (!["BREAKFAST", "LUNCH", "DINNER"].includes(type)) {
      return Response.json(
        { error: "Invalid meal type. Must be BREAKFAST, LUNCH, or DINNER" },
        { status: 400 }
      );
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return Response.json(
        { error: "At least one ingredient is required" },
        { status: 400 }
      );
    }

    // Validate ingredients
    for (const ing of ingredients) {
      if (!ing.itemName || !ing.gramsPerPax) {
        return Response.json(
          { error: "Each ingredient must have itemName and gramsPerPax" },
          { status: 400 }
        );
      }
      if (parseInt(ing.gramsPerPax) <= 0) {
        return Response.json(
          { error: "gramsPerPax must be greater than 0" },
          { status: 400 }
        );
      }
    }

    // Parse and validate date
    const mealDate = new Date(date);
    if (isNaN(mealDate.getTime())) {
      return Response.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Create meal with ingredients
    const meal = await prisma.meal.create({
      data: {
        title,
        type,
        date: mealDate,
        imgURL: imgURL || "https://eduauraapublic.s3.ap-south-1.amazonaws.com/webassets/images/blogs/indian-food-nutrition.jpg",
        ingredients: {
          create: ingredients.map((ing) => ({
            itemName: ing.itemName,
            gramsPerPax: parseInt(ing.gramsPerPax),
          })),
        },
      },
      include: {
        ingredients: true,
      },
    });

    return Response.json(
      {
        message: "Meal created successfully",
        meal,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle unique constraint error (same meal type and date)
    if (error.code === "P2002") {
      return Response.json(
        {
          error: "A meal with this type already exists for the selected date",
        },
        { status: 409 }
      );
    }

    console.error("Error creating meal:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 }
      );
    }

    // Check authorization (admin only)
    if (session.user.role !== "ADMIN") {
      return Response.json(
        { error: "Forbidden: Only admins can view meals" },
        { status: 403 }
      );
    }

    // Get all meals
    const meals = await prisma.meal.findMany({
      include: {
        ingredients: true,
        attendance: true,
        feedback: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return Response.json({ meals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
