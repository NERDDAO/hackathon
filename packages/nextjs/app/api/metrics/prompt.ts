import { Db } from "mongodb";

export async function storePrompt(
 db: Db,
 project: any,
 prompt: any,
 embeddingId: string,
 usedEmbeddingIds: string[],
 response: any,
) {
 const prompts = db.collection("prompts");

 const promptData = {
  prompt,
  usedEmbeddingIds,
  response,
  address: project.address,
  projectId: project.projectId || project.id,
  embeddingId,
 };

 const promptResult = await prompts.insertOne(promptData);

 return { promptResult };
}
