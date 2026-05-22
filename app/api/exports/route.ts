import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { COLLECTIONS, RoastExport } from "@/lib/models";
import { ensureDbIndexes } from "@/lib/db-indexes";
import { exportsPostSchema, paginationSchema } from "@/lib/validators";

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

  const [exportsList, total] = await Promise.all([
    db
      .collection(COLLECTIONS.exports)
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTIONS.exports).countDocuments({ userId }),
  ]);

  return NextResponse.json({
    exports: exportsList,
    page,
    limit,
    total,
    hasMore: skip + exportsList.length < total,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = exportsPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid export payload" }, { status: 400 });
  }

  const { roastHistoryId, sizePreset, url, fileMeta } = parsed.data;

  if (roastHistoryId && !ObjectId.isValid(roastHistoryId)) {
    return NextResponse.json({ error: "Invalid roastHistoryId" }, { status: 400 });
  }

  await ensureDbIndexes();
  const client = await clientPromise;
  const db = client.db();

  const exportDoc: RoastExport = {
    userId,
    sizePreset,
    ...(roastHistoryId ? { roastHistoryId: new ObjectId(roastHistoryId) } : {}),
    ...(url ? { url } : {}),
    ...(fileMeta ? { fileMeta } : {}),
    createdAt: new Date(),
  };

  const result = await db.collection(COLLECTIONS.exports).insertOne(exportDoc);

  return NextResponse.json({ exportId: result.insertedId, export: exportDoc });
}
