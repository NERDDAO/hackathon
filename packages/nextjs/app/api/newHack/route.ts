import { NextResponse } from "next/server";
import OpenAI from "openai";
// Assuming we've defined or imported types for the Hackathon Application
import type { HackathonEntry } from "~~/types/dbSchema";

// Assumed environme
import { MongoDBAtlasVectorSearch, VectorStoreIndex, storageContextFromDefaults, Document } from "llamaindex";
import { MongoClient } from "mongodb";



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
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_AUTH_TOKEN,
    });

    const messages: any[] = [
        {
            role: "system",
            content: `You are an AI consultant specializing in hackathon project conceptualization. Given a project name, problem statement, solution description, and technology stack, generate an enhanced project proposal. Focus on elaborating the solution, suggesting improvements, and identifying potential challenges. Reply in JSON format using the HackathonEntry schema.`,
        },
        {
            role: "assistant",
            content: `
                type HackathonEntry = {
  projectId: ${hackathonApp.projectId};
  projectName: ${hackathonApp.projectName};
  projectname: ${hackathonApp.projectName}
  problemStatement: ${hackathonApp.problemStatement}
  solutionDescription: ${hackathonApp.solutionDescription}
  technologyStack: ${hackathonApp.technologyStack.join(", ")}
  teamMembers: ${hackathonApp.teamMembers};
  coherenceScore: number;
  evaluationRemarks: string;
                }
            `,
        },
        {
            role: "user",
            content: `Review the hackathon entry, assign a coherence score and provide evaluation remarks.
Project Name: ${hackathonApp.projectName}
Problem Statement: ${hackathonApp.problemStatement}
Solution Description: ${hackathonApp.solutionDescription}
Technology Stack: ${hackathonApp.technologyStack.join(", ")}
            `,
        },
    ];

    const stream = await openai.chat.completions.create({
        model: "gpt-4-1106-preview", // Ensure you're using the correct and available model
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 0.5,
    });

    const rawOutput = stream.choices[0].message.content;
    return rawOutput?.trim();
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

    llamaindex(JSON.stringify(enhancedProposal), hackathonApp.projectId);//should we modify this id?

    await hackCodex.updateOne(
        { _id: hackathonApp.projectId },
        {
            $addToSet: {
                hack: JSON.parse(enhancedProposal || "{}"),
            }
        },
        { upsert: true },// this creates new document if none match the filter
    );

    // Implementation depends on application requirements.
    //
    return NextResponse.json(enhancedProposal);
}
