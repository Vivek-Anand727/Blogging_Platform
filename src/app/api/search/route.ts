import { connectToDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const {db} = await connectToDB();
        const query = req.nextUrl.searchParams.get("query");
    
        if (!query || query.trim() === "") {
            return NextResponse.json({
                success: false,
                message: "Search query is required"
            }, { status: 400 });
        }

        const searchResults = await db?.collection("posts").find(
            { $text: { $search: query } },
            { projection: { title: 1, content: 1, score: { $meta: "textScore" } } }
        )
        .sort({ score: { $meta: "textScore" } })
        .toArray();
    
        return NextResponse.json({
             success: true,
             searchResults
        },{status:200});
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Search failed",
            error: (error as Error).message
        }, { status: 500 });
    }

}