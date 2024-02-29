import { PDFReader } from "llamaindex/readers/PDFReader";
import { NextResponse } from "next/server";
import clientPromise from "~~/app/lib/mongodb";
import * as fs from "fs";
import { SimpleDirectoryReader } from 'llamaindex'


import path from 'path'
import {
    MongoDBAtlasVectorSearch,
    SimpleMongoReader,
    storageContextFromDefaults,
    VectorStoreIndex,
} from "llamaindex";

// Load environment variables from local .env file

const databaseName = "aiUniverse";
const collectionName = "bookStore";





async function importPDFToMongo() {
    const filereader = new SimpleDirectoryReader();
    const documents = await filereader.loadData("./data");



    // Create a new client and connect to the server
    const client = await clientPromise;

    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    // Insert the tweets into mongo
    documents.forEach(async (doc) => {

        await collection.insertMany([doc]);
        console.log(`document (${doc.id_}):`, doc.getText());
    });

    console.log(
        `Data imported successfully to the MongoDB collection ${collectionName}.`,
    );

    // Create a new client and connect to the server
    // load objects from mongo and convert them into LlamaIndex Document objects
    // llamaindex has a special class that does this for you
    // it pulls every object in a given collection
    const reader = new SimpleMongoReader(client);
    const dbdocuments = await reader.loadData(databaseName, collectionName, [
        "full_text",
    ]);
    const vectorCollectionName = "hackerIndex";
    const indexName = "hacker_index";

    // create Atlas as a vector store
    const vectorStore = new MongoDBAtlasVectorSearch({
        mongodbClient: client,
        dbName: databaseName,
        collectionName: vectorCollectionName, // this is where your embeddings will be stored
        indexName: indexName, // this is the name of the index you will need to create
    });

    // now create an index from all the Documents and store them in Atlas
    const storageContext = await storageContextFromDefaults({ vectorStore });
    await VectorStoreIndex.fromDocuments(dbdocuments, { storageContext });
    console.log(
        `Successfully created embeddings in the MongoDB collection ${vectorCollectionName}.`,
    );
    await client.close();
}

export async function GET() {
    // Database Name
    // Use connect method to connect to the server
    try {
        await importPDFToMongo();


        return NextResponse.json({ message: 'success' })
    } catch (e: any) {
        console.error(e);
        return NextResponse.json(e.message);
    }
}
