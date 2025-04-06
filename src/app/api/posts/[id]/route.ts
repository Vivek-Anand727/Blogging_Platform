import { NextRequest , NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/lib/mongodb";
import client from "@/lib/redis";
import { rateLimit } from "@/app/utils/rateLimit";
import { cacheResponse } from "@/app/utils/cache";



//DELETION
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

//GETTING
export async function GET(req:NextRequest, { params } :{params : { id:string}}){
    const {id} = await params;
    const {db} = await connectToDB();
    const cachedData = await client.get(`post-${id}`);
    if(cachedData){
        return NextResponse.json(
            JSON.parse(cachedData)
        );
    }else{
        const post = await db?.collection("posts").findOne({_id : new ObjectId(id)});
        if(!post){
            return NextResponse.json({ 
                success: false, 
                message: "Post not found" 
            }, { status: 404 });

        }
        await client.setEx(`post-${id}`,600,JSON.stringify(post));
        return NextResponse.json(post);
    }
}



// export async function DELETE(req: NextRequest) {
//     try {
//         const postId = req.nextUrl.searchParams.get("id");
//         if (!postId || !ObjectId.isValid(postId)) {
//             return NextResponse.json({ success: false, message: "Invalid post ID" }, { status: 400 });
//         }

//         const userId = req.headers.get("id");
//         const role = req.headers.get("role") || "";

//         if (!userId) {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const limitCheck = await rateLimit(userId, 5, 300); 
//         if (!limitCheck.allowed) {
//             return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
//         }

//         const { db } = await connectToDB();
//         const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });

//         if (!post) {
//             return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
//         }

//         if (role !== "admin" && post.author.toString() !== userId) {
//             return NextResponse.json({ success: false, message: "Permission denied" }, { status: 403 });
//         }

//         await db?.collection("posts").deleteOne({ _id: new ObjectId(postId) });

//         await client.keys("posts-page-*").then((keys) => keys.forEach((key) => client.del(key)));

//         return NextResponse.json({ success: true, message: "Post deleted successfully" });
//     } catch (error) {
//         console.error("DELETE ERROR:", error);
//         return NextResponse.json({ success: false, message: "Failed to delete post" }, { status: 500 });
//     }
// }


export async function PUT(req: NextRequest) {
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

