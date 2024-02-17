import { NextResponse } from "next/server";
// Assuming we've defined or imported types for the Hackathon Application
//

import type { AIEvaluation, HackathonEntry } from "~~/types/dbSchema";

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
    const messages: ChatMessage[] = [
        {
            role: "system",
            content: `You are an AI consultant specializing in hackathon project conceptualization. Given a project name, problem statement, solution description, and technology stack, Ponder on the different aspects of the presented project and give a score for each domain. Use the evaluationRemarks to appraise the projects and compare them to each other. Suggest collaboration opportunities, code snippets or advice that may help hackers. Reply in JSON format using the AIEvaluation type.`,
        },
        {
            role: "assistant",
            content: `
            type AIEvaluation = {
         coherenceScore: number;
         feasabilityScore: number;
         innovationScore: number;
         funScore: number;
         evaluationRemarks: string;
        codeSnippets: CodeEntry[];
                }

            type CodeEntry = {
        code: string;
        comment: string;
        language: string;
                    }
                    
            `,
        },
        {
            role: "user",
            content: `Review the hackathon update, assign scores and provide feedback in the evaluation remarks.
  _id: ${hackathonApp._id};
  projectName: ${hackathonApp.hack.projectName};
  problemStatement: ${hackathonApp.hack.problemStatement}
  solutionDescription: ${hackathonApp.hack.solutionDescription}
  technologyStack: ${hackathonApp.hack.technologyStack.join(", ")}
previousEvaluations: ${hackathonApp.eval.join(", ") ?? "No previous evaluation"}
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

    console.log(JSON.parse(response.response))

    const rawOutput: AIEvaluation = JSON.parse(response.response);
    return rawOutput;
}

// Example usage for POST handler or another part of your application
export async function POST(request: Request) {
    const hackathonApp = await request.json(); // Assuming the request body is properly formatted
    const enhancedProposal = await generateHackathonProposal(hackathonApp);


    hackathonApp.eval.push(enhancedProposal);

    const stringifiedHackathonApp = JSON.stringify(hackathonApp);


    // Proceed with storing the enhanced proposal in MongoDB or returning it in the response
    //
    const db = client.db("aiUniverse"); // Connect to the database
    const hackCodex = db.collection('hackerUniverse'); // 

    // assumed input

    llamaindex(JSON.stringify(stringifiedHackathonApp), hackathonApp.projectId);//should we modify this id?



    await hackCodex.updateOne(
        {
            _id: hackathonApp._id,
            address: hackathonApp.address,
            hack: hackathonApp.hack
        },
        {
            $addToSet: {
                eval: enhancedProposal,
                progressUpdates: hackathonApp.progressUpdates[hackathonApp.progressUpdates.length - 1]
            }
        },
        { upsert: true },// this creates new document if none match the filter
    );

    // Implementation depends on application requirements.
    //
    return NextResponse.json(hackathonApp, { status: 200 })
}
