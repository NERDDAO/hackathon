

import clientPromise from "~~/app/lib/mongodb";

import { NextResponse } from "next/server";



export async function GET(req: Request) {
    let aiu
    // Database Name
    // Use connect method to connect to the server
    const { searchParams } = new URL(req.url);
    const param = searchParams.get("id");
    console.log(param);
    try {
        const client = await clientPromise;

        const db = client.db("aiUniverse"); // Connect to the Database

        aiu = await db
            .collection("hackerUniverse")
            .find({ address: param })
            .limit(50)
            .toArray();

        return NextResponse.json(aiu); // Response to MongoClient
    } catch (e: any) {
        console.error(e);
        return NextResponse.json(e.message);
    }
    // Get all players from collection
}



