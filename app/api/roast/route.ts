import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateRoast } from "@/lib/gemini";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { COLLECTIONS, RoastHistory } from "@/lib/models";
import { ensureDbIndexes } from "@/lib/db-indexes";
import { roastRequestSchema } from "@/lib/validators";

function getUserIdFromSession(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserIdFromSession(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = roastRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid roast payload" }, { status: 400 });
    }

    await ensureDbIndexes();
    const client = await clientPromise;
    const db = client.db();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const dailyRoastsCount = await db.collection(COLLECTIONS.roastHistory).countDocuments({
      userId,
      createdAt: { $gte: startOfDay },
    });

    if (dailyRoastsCount >= 3) {
      const resetDate = new Date(startOfDay);
      resetDate.setDate(resetDate.getDate() + 1);
      const resetString = resetDate.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      });

      return NextResponse.json(
        { error: `Daily limit reached (3/3). Your usage will reset on ${resetString}.` },
        { status: 429 }
      );
    }

    const { image, intensity, userDefense, language } = parsed.data;
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, "");

    const roast = await generateRoast(base64Image, intensity, userDefense, language);

    const roastDoc: RoastHistory = {
      userId,
      imageRef: image,
      imageHash: createHash("sha256").update(base64Image).digest("hex"),
      roastText: roast,
      intensity,
      language,
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTIONS.roastHistory).insertOne(roastDoc);

    return NextResponse.json({ roast, roastId: result.insertedId.toString() });
  } catch (error) {
    console.error("Roast API error:", error);
    return NextResponse.json(
      { error: "Failed to generate roast. Please try again." },
      { status: 500 },
    );
  }
}
