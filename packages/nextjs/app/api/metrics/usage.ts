import { Db } from "mongodb";

export async function storeUsageByEmbeddingId(
 db: Db,
 projectId: string,
 embeddingId: string,
 usedEmbeddingIds: string[],
) {
 const hackIndex = db.collection("hackerIndex");
 const usage = db.collection("usage");

 const usageData = {
  projectId: projectId,
  embeddingId,
  usedEmbeddingIds,
 };

 const usageResult = await usage.insertOne(usageData);
 const incrementUsageFieldResult = await hackIndex.updateMany(
  { id: { $in: usedEmbeddingIds } },
  { $inc: { "metadata.usage": 1 } },
  { upsert: true },
 );
 return { usageResult, incrementUsageFieldResult };
}
