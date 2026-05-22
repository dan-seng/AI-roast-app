import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { ensureDbIndexes } from "@/lib/db-indexes";
import { COLLECTIONS, createDefaultUserProfile } from "@/lib/models";
import { profilePatchSchema } from "@/lib/validators";

function getUserIdFromSession(session: Awaited<ReturnType<typeof getServerSession>>) {
  return (session?.user as { id?: string } | undefined)?.id;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureDbIndexes();
  const client = await clientPromise;
  const db = client.db();

  let profile = await db.collection(COLLECTIONS.userProfiles).findOne({ userId });

  if (!profile) {
    const defaultProfile = createDefaultUserProfile(userId);
    await db.collection(COLLECTIONS.userProfiles).insertOne(defaultProfile);
    profile = defaultProfile;
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = profilePatchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile payload" }, { status: 400 });
  }

  const { name, bio, avatar, plan, preferences } = parsed.data;

  await ensureDbIndexes();
  const client = await clientPromise;
  const db = client.db();

  const existing = await db.collection(COLLECTIONS.userProfiles).findOne({ userId });
  const base = existing || createDefaultUserProfile(userId);

  const nextDoc = {
    ...base,
    ...(name !== undefined ? { name } : {}),
    ...(bio !== undefined ? { bio } : {}),
    ...(avatar !== undefined ? { avatar } : {}),
    ...(plan !== undefined ? { plan } : {}),
    ...(preferences ? { preferences: { ...base.preferences, ...preferences } } : {}),
    updatedAt: new Date(),
  };

  await db
    .collection(COLLECTIONS.userProfiles)
    .updateOne({ userId }, { $set: nextDoc }, { upsert: true });

  return NextResponse.json({ profile: nextDoc });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();

  await Promise.all([
    db.collection(COLLECTIONS.userProfiles).deleteOne({ userId }),
    db.collection(COLLECTIONS.roastHistory).deleteMany({ userId }),
    db.collection(COLLECTIONS.exports).deleteMany({ userId }),
  ]);

  if (ObjectId.isValid(userId)) {
    const objectUserId = new ObjectId(userId);
    await Promise.all([
      db.collection("accounts").deleteMany({ userId: objectUserId }),
      db.collection("sessions").deleteMany({ userId: objectUserId }),
      db.collection("users").deleteOne({ _id: objectUserId }),
    ]);
  }

  return NextResponse.json({ success: true });
}
