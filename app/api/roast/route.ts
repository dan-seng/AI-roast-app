import { NextRequest, NextResponse } from "next/server";
import { generateRoast } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, intensity, userDefense, language } = body;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (!intensity) {
      return NextResponse.json(
        { error: "Intensity is required" },
        { status: 400 },
      );
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, "");

    const roast = await generateRoast(
      base64Image,
      intensity,
      userDefense,
      language,
    );

    return NextResponse.json({ roast });
  } catch (error) {
    console.error("Roast API error:", error);
    return NextResponse.json(
      { error: "Failed to generate roast. Please try again." },
      { status: 500 },
    );
  }
}
