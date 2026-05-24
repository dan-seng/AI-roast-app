import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/models";

function getUserIdFromSession(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) return new NextResponse("Invalid id", { status: 400 });

  const client = await clientPromise;
  const db = client.db();

  const roast = await db
    .collection(COLLECTIONS.roastHistory)
    .findOne({ _id: new ObjectId(id), userId }, { projection: { imageRef: 1 } });

  if (!roast || !roast.imageRef) {
    return new NextResponse("Image not found", { status: 404 });
  }

  const match = roast.imageRef.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    return new NextResponse("Invalid image data", { status: 500 });
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
