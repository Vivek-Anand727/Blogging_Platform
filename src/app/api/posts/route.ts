import { connectToDB } from "@/lib/mongodb";
import {NextRequest,NextResponse} from "next/server"
import { ObjectId } from "mongodb"; 
import { rateLimit } from "@/app/utils/rateLimit";
import client from "@/lib/redis";
import { cacheResponse } from "@/app/utils/cache";

export async function POST(req: NextRequest){
    const {title,content,tags} = await req.json();

    if(!title || !content){
        return NextResponse.json({
            success : false,
            message : "Both content and title are required"
        },{status:400}
    )}

    const authorUser = req.headers.get("id");
    if(!authorUser){
        return NextResponse.json({
            success:false,
            message : "UserAuthor is missing"
        },{status : 400})
    }

    try {
        
        const { db } = await connectToDB();

        const newPost = {
            title,
            content,
            tags,
            author : new ObjectId(authorUser),
            createdAt : new Date()
        }

        const limitCheck = await rateLimit(authorUser,10,600);
        if(limitCheck.allowed){
            await db?.collection("posts").insertOne(newPost);

            await client.del("all-posts");

        return NextResponse.json({
            success:true,
            message : "Post created successfully"
        },{status : 201})
        }else{
            return NextResponse.json({
                success:false,
                message : "Too many requests"
            },{status : 429})
        }

        

    } catch (error) {
        console.error("POST CREATION ERROR", error);
        return NextResponse.json({
            success:false,
            message : "Failed to create the post"
        },{status : 500})
    }

}

export async function GET() {

    const fetchFunction = async ()=>{
        const {db} = await connectToDB();
        if(!db){
            console.log("posts - db error");
            return [];
        }
        return await db?.collection("posts").find().toArray();
    }

    return NextResponse.json(
        await cacheResponse("all-posts",fetchFunction,600)
    )
}