import clientPromise from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/models";

let indexesEnsured = false;

export async function ensureDbIndexes() {
  if (indexesEnsured) return;

  const client = await clientPromise;
  const db = client.db();

  await db.collection(COLLECTIONS.userProfiles).createIndex({ userId: 1 }, { unique: true });

  await db.collection(COLLECTIONS.roastHistory).createIndex({ userId: 1, createdAt: -1 });
  await db.collection(COLLECTIONS.roastHistory).createIndex({ imageHash: 1 });

  await db.collection(COLLECTIONS.exports).createIndex({ userId: 1, createdAt: -1 });
  await db.collection(COLLECTIONS.exports).createIndex({ roastHistoryId: 1 });

  indexesEnsured = true;
}
