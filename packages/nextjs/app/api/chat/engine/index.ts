import { LLM, ServiceContext, ContextChatEngine, ContextSystemPrompt } from "llamaindex";
import { getDataSource } from "../datasource";



export async function createChatEngine(
    serviceContext: ServiceContext,
) {
    const index = await getDataSource(serviceContext);

    const retriever = index!.asRetriever();
    retriever.similarityTopK = 5;
    return new ContextChatEngine({
        chatModel: serviceContext.llm,
        retriever,
    });




}
