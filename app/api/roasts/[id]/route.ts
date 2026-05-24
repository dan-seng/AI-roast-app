import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/models";

function getUserIdFromSession(session: unknown) {
  return (session as { user?: { id?: string } } | null)?.user?.id;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid roast id" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const result = await db
    .collection(COLLECTIONS.roastHistory)
    .deleteOne({ _id: new ObjectId(id), userId });

  if (!result.deletedCount) {
    return NextResponse.json({ error: "Roast not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
