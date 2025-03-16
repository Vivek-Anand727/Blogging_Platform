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

    if(tags && !Array.isArray(tags)){
        return NextResponse.json({
            success:false,
            message : "Tags should be array"
        },{status:400});
    }

    const authorUser = req.headers.get("id");
    if(!authorUser){
        return NextResponse.json({
            success:false,
            message : "UserAuthor is missing"
        },{status : 400})
    }
    
    const role = req.headers.get("role") || "";
    if (!["admin", "author"].includes(role)) {
    return NextResponse.json({
        success: false,
        message: "Unauthorized action"
        }, { status: 403 });
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

            await client.keys("posts-page-*").then((keys) => keys.forEach((key) => client.del(key)));

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

export async function GET(req:NextRequest ) {

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const sort = req.nextUrl.searchParams.get("sort") || "ascending";
    const authorName = req.nextUrl.searchParams.get("authorName") || "";
    const tags = req.nextUrl.searchParams.get("tags") ? req.nextUrl.searchParams.get("tags")?.split(",") : [];


    if(!["ascending" ,"descending"].includes(sort)){
            return NextResponse.json({
                success:false,
                message :"Wrong sorting options"
            },{status:400})
        }
    const fetchFunction = async ()=>{
       const {db} = await connectToDB();
        if(!db){
            console.log("posts - db error");
            return [];
        }

        const query : any = {};
        if (authorName) {
            try {
                query.author = new ObjectId(authorName);
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid author ID format"
                }, { status: 400 });
            }
        }
        if(Array.isArray(tags) && tags.length > 0) query.tags = {$in:tags}

        let sortingOption : any = {};
        if(sort === "ascending") sortingOption = {createdAt:1}
        if(sort === "descending") sortingOption = {createdAt:-1}

        const totalPosts =  await db.collection("posts").countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit) ; 

        const eligiblePosts =  await db?.collection("posts")
        .find(query)
        .sort(sortingOption)
        .skip((page-1) * limit)
        .limit(limit)
        .toArray();

        return {posts : eligiblePosts, totalPages, totalPosts, currentpage : page};
    }

    try {
        return NextResponse.json(
            await cacheResponse(`posts-page-${page}`,fetchFunction,600)
        );
    } catch (error) {
        console.error("GET POSTS ERROR", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch posts"
        }, { status: 500 });
    }

}


export async function DELETE(req: NextRequest) {
    try {
        const postId = req.nextUrl.searchParams.get("id");
        if (!postId || !ObjectId.isValid(postId)) {
            return NextResponse.json({ success: false, message: "Invalid post ID" }, { status: 400 });
        }

        const userId = req.headers.get("id");
        const role = req.headers.get("role") || "";

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const limitCheck = await rateLimit(userId, 5, 300); 
        if (!limitCheck.allowed) {
            return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
        }

        const { db } = await connectToDB();
        const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        if (role !== "admin" && post.author.toString() !== userId) {
            return NextResponse.json({ success: false, message: "Permission denied" }, { status: 403 });
        }

        await db?.collection("posts").deleteOne({ _id: new ObjectId(postId) });

        await client.keys("posts-page-*").then((keys) => keys.forEach((key) => client.del(key)));

        return NextResponse.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        return NextResponse.json({ success: false, message: "Failed to delete post" }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest) {
    try {
        const postId = req.nextUrl.searchParams.get("id");
        if (!postId || !ObjectId.isValid(postId)) {
            return NextResponse.json({ success: false, message: "Invalid post ID" }, { status: 400 });
        }

        const { title, content, tags } = await req.json();

        if (!title && !content && !tags) {
            return NextResponse.json({ success: false, message: "Nothing to update" }, { status: 400 });
        }

        const userId = req.headers.get("id");
        const role = req.headers.get("role") || "";

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const limitCheck = await rateLimit(userId, 10, 600); 
        if (!limitCheck.allowed) {
            return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
        }

        const { db } = await connectToDB();
        const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        if (role !== "admin" && post.author.toString() !== userId) {
            return NextResponse.json({ success: false, message: "Permission denied" }, { status: 403 });
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (tags && Array.isArray(tags)) updateData.tags = tags;

        await db?.collection("posts").updateOne({ _id: new ObjectId(postId) }, { $set: updateData });

        await client.keys("posts-page-*").then((keys) => keys.forEach((key) => client.del(key)));

        return NextResponse.json({ success: true, message: "Post updated successfully" });
    } catch (error) {
        console.error("UPDATE ERROR:", error);
        return NextResponse.json({ success: false, message: "Failed to update post" }, { status: 500 });
    }
}
