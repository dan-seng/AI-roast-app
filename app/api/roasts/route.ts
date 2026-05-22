import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/models";
import { ensureDbIndexes } from "@/lib/db-indexes";
import { paginationSchema } from "@/lib/validators";

function getUserIdFromSession(session: Awaited<ReturnType<typeof getServerSession>>) {
  return (session?.user as { id?: string } | undefined)?.id;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = paginationSchema.safeParse({
    page: request.nextUrl.searchParams.get("page") ?? 1,
    limit: request.nextUrl.searchParams.get("limit") ?? 20,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid pagination params" }, { status: 400 });
  }

  const { page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  await ensureDbIndexes();
  const client = await clientPromise;
  const db = client.db();

  const [roasts, total] = await Promise.all([
    db
      .collection(COLLECTIONS.roastHistory)
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTIONS.roastHistory).countDocuments({ userId }),
  ]);

  return NextResponse.json({
    roasts,
    page,
    limit,
    total,
    hasMore: skip + roasts.length < total,
  });
}
