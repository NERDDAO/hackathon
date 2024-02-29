import { NextResponse } from "next/server";
import { createChatEngine } from "../chat/engine";
import { storeEvaluationByProject } from "../metrics/evaluation";
import { storePrompt } from "../metrics/prompt";
import { storeUsageByEmbeddingId } from "../metrics/usage";
// Assumed environme
import {
    ChatMessage,
    Document,
    MongoDBAtlasVectorSearch,
    VectorStoreIndex,
    storageContextFromDefaults,
} from "llamaindex";
import { OpenAI, serviceContextFromDefaults } from "llamaindex";
import { Db, MongoClient } from "mongodb";
// Assuming we've defined or imported types for the Hackathon Application
import type { AIEvaluation, HackathonEntry } from "~~/types/dbSchema";

const url = "mongodb+srv://At0x:r8MzJR2r4A1xlMOA@cluster1.upfglfg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);
await client.connect();
// Database Name

async function llamaindex(payload: string, id: string) {
    const vectorStore = new MongoDBAtlasVectorSearch({
        mongodbClient: client,
        dbName: "aiUniverse",
        collectionName: "hackerIndex", // this is where your embeddings will be stored
        indexName: "hacker_index", // this is the name of the index you will need to create
    });

    // now create an index from all the Documents and store them in Atlas
    const storageContext = await storageContextFromDefaults({ vectorStore });

    const essay = payload;

    // Create Document object with essay
    const document = new Document({ text: essay, id_: id });
    console.log({ document });
    // Split text and create embeddings. Store them in a VectorStoreIndex
    const result = await VectorStoreIndex.fromDocuments([document], { storageContext });
    const embeddingResults = await result.getNodeEmbeddingResults([document]);
    console.log({ result, embeddingResults });
    const db = client.db("aiUniverse"); // Connect to the database
    const hackIndex = db.collection("hackerIndex");

    const embedding = await hackIndex.findOne({ "metadata.doc_id": id });

    console.log({ embeddingId: embedding?.id });
    console.log(`Successfully created embeddings in the MongoDB collection`);
    return { embeddingId: embedding?.id as string, result: embeddingResults };
}

async function runLlamaAndStore(
    db: Db,
    hackathonApp: any,
    enhancedProposal: AIEvaluation,
    usedEmbeddingIds: string[],
    promptMessages: any,
    promptResponse: any,
    evaluation: AIEvaluation,
) {
    const projectId = hackathonApp.projectId || hackathonApp.id;
    const { embeddingId } = await llamaindex(JSON.stringify(hackathonApp), projectId); //should we modify this id?
    // store in DB
    const promptResult = await storePrompt(
        db,
        hackathonApp,
        promptMessages,
        embeddingId,
        usedEmbeddingIds,
        promptResponse,
    );
    const usageResult = await storeUsageByEmbeddingId(db, projectId, embeddingId, usedEmbeddingIds);
    const evaluationResult = await storeEvaluationByProject(db, projectId, usedEmbeddingIds, embeddingId, evaluation);
    return {
        promptResult,
        usageResult,
        evaluationResult,
    };
}

// Revised function suited for hackathon application data
async function generateHackathonProposal(hackathonApp: HackathonEntry) {
    const messages: ChatMessage[] = [
        {
            role: "system",
            content: `You are an AI consultant specializing in hackathon project conceptualization. Given a project name, problem statement, solution description, and technology stack, Ponder on the different aspects of the presented project and give a score for each domain. Use the evaluationRemarks to appraise the projects and compare them to each other. Reply in JSON format using the AIEvaluation type.`,
        },
        {
            role: "assistant",
            content: `
            type AIEvaluation = {
         coherenceScore: number;
         feasibilityScore: number;
         innovationScore: number;
         funScore: number;
         evaluationRemarks: string;
        codeSnippets: CodeEntry[];
                }
            `,
        },
        {
            role: "user",
            content: `Review the hackathon entry, assign scores and provide evaluation remarks.
  _id: ${hackathonApp._id};
  projectName: ${hackathonApp.hack.projectName};
  problemStatement: ${hackathonApp.hack.problemStatement}
  solutionDescription: ${hackathonApp.hack.solutionDescription}
  technologyStack: ${hackathonApp.hack.technologyStack.join(", ")}
            `,
        },
    ];

    const llm = new OpenAI({
        model: (process.env.MODEL as any) ?? "gpt-4-0125-preview",
        maxTokens: 512,
        additionalChatOptions: { response_format: { type: "json_object" } },
    });

    const serviceContext = serviceContextFromDefaults({
        llm,
        chunkSize: 512,
        chunkOverlap: 20,
    });

    const chatEngine = await createChatEngine(serviceContext);
    if (!chatEngine) {
        throw new Error("datasource is required in the request body");
    }

    // Convert message content from Vercel/AI format to LlamaIndex/OpenAI format

    const response = await chatEngine.chat({
        message: "Evaluate the hackathon entry and provide scores and remarks.",
        chatHistory: messages,
    });
    console.log({
        response,
        serviceContext,
        raw: response.response,
        sourceNodes: JSON.stringify(response.sourceNodes),
        firstNode: !!response.sourceNodes?.length && response.sourceNodes[0],
    });
    const usedEmbeddingIds = response.sourceNodes?.map(node => node.id_) || [];
    const parsedResponse = JSON.parse(response.response);
    const evaluation: AIEvaluation = {
        coherenceScore: parsedResponse.coherenceScore,
        feasibilityScore: parsedResponse.feasibilityScore,
        innovationScore: parsedResponse.innovationScore,
        funScore: parsedResponse.funScore,
        evaluationRemarks: parsedResponse.evaluationRemarks,
        codeSnippets: parsedResponse.codeSnippets,
    };

    const rawOutput: AIEvaluation = JSON.parse(response.response);
    return { enhancedProposal: rawOutput, messages, response: parsedResponse, usedEmbeddingIds, evaluation };
}

// Example usage for POST handler or another part of your application
export async function POST(request: Request) {
    try {
        const hackathonApp = await request.json(); // Assuming the request body is properly formatted
        console.log(hackathonApp);
        const { enhancedProposal, usedEmbeddingIds, messages, response, evaluation } = await generateHackathonProposal(
            hackathonApp,
        );
        hackathonApp.eval.push(enhancedProposal);



        // Proceed with storing the enhanced proposal in MongoDB or returning it in the response
        //
        const db = client.db("aiUniverse"); // Connect to the database
        const hackCodex = db.collection("hackerUniverse"); //
        // assumed input
        // run this function asynchronously, do not block for it to finish
        runLlamaAndStore(db, hackathonApp, enhancedProposal, usedEmbeddingIds, messages, response, evaluation);

        await hackCodex.updateOne(
            {
                _id: hackathonApp._id,
                address: hackathonApp.address,
                hack: hackathonApp.hack,
            },
            {
                $addToSet: {
                    eval: enhancedProposal,
                    progressUpdates: hackathonApp.progressUpdates[hackathonApp.progressUpdates.length - 1],
                },
            },
            { upsert: true }, // this creates new document if none match the filter
        );

        // Implementation depends on application requirements.
        //
        return NextResponse.json(hackathonApp, { status: 200 });
        // Implementation depends on application requirements.
        //
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || "An error occurred processing the request" }, { status: 500 });
        // Handle error
        //
    }
}
