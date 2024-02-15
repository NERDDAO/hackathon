import { NextResponse } from "next/server";
// Assuming we've defined or imported types for the Hackathon Application
//

import type { HackathonEntry } from "~~/types/dbSchema";

// Assumed environme
import { MongoDBAtlasVectorSearch, VectorStoreIndex, storageContextFromDefaults, Document } from "llamaindex";
import { MongoClient } from "mongodb";

import { ChatMessage, MessageContent, OpenAI, serviceContextFromDefaults } from "llamaindex";
import { createChatEngine } from "../chat/engine";

const url = 'mongodb+srv://At0x:r8MzJR2r4A1xlMOA@cluster1.upfglfg.mongodb.net/?retryWrites=true&w=majority'

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

    // Split text and create embeddings. Store them in a VectorStoreIndex
    await VectorStoreIndex.fromDocuments([document], { storageContext });

    console.log(
        `Successfully created embeddings in the MongoDB collection`,
    );
}

// Revised function suited for hackathon application data
async function generateHackathonProposal(hackathonApp: HackathonEntry) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are an AI consultant specializing in hackathon project conceptualization. Given a project name, problem statement, solution description, and technology stack, Ponder on the different aspects of the presented project and give a score for each domain. Use the evaluationRemarks to appraise the projects and compare them to each other. Reply in JSON format using the Eval type.`,
        },
        {
            role: "assistant",
            content: `
              type Eval = {
         coherenceScore: number;
         feasabilityScore: number;
         innovationScore: number;
         funScore: number;
         evaluationRemarks: string;
                }
            `,
        },
        {
            role: "user",
            content: `Review the hackathon entry, assign scores and provide evaluation remarks.
  projectId: ${hackathonApp.projectId};
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


    const chatEngine = await createChatEngine(
        serviceContext,
    );
    if (!chatEngine) return NextResponse.json({ error: "datasource is required in the request body" }, { status: 400 });

    // Convert message content from Vercel/AI format to LlamaIndex/OpenAI format


    const response = await chatEngine.chat({
        message: "Evaluate the hackathon entry and provide scores and remarks.",
        chatHistory: messages,
    });

    const rawOutput = response.response;
    return rawOutput;
}

// Example usage for POST handler or another part of your application
export async function POST(request: Request) {
    const hackathonApp = await request.json(); // Assuming the request body is properly formatted
    console.log(hackathonApp);
    const enhancedProposal = await generateHackathonProposal(hackathonApp);
    console.log(enhancedProposal, "Enhanced Proposal");


    // Proceed with storing the enhanced proposal in MongoDB or returning it in the response
    //
    const db = client.db("aiUniverse"); // Connect to the database
    const hackCodex = db.collection('hackerUniverse'); // 

    // assumed input

    llamaindex(JSON.stringify(enhancedProposal + hackathonApp), hackathonApp.projectId);//should we modify this id?

    await hackCodex.updateOne(
        {
            _id: hackathonApp.projectId,
            address: hackathonApp.address,
            hack: hackathonApp.hack
        },
        {
            $addToSet: {
                eval: enhancedProposal,
            }
        },
        { upsert: true },// this creates new document if none match the filter
    );

    // Implementation depends on application requirements.
    //
    return NextResponse.json(enhancedProposal);
}
