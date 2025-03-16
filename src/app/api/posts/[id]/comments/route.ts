import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

//POST
export async function POST(req : NextRequest){
    try {
        const {db} = await connectToDB();
        const {comment,postId} = await req.json();
        const userId = req.headers.get("id");
    
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 403 });
        }

        const post = await db?.collection("posts").findOne({_id : new ObjectId(postId)});
    
        if(!post){
            return NextResponse.json({
                success:false,
                message :"Post not found"
            },{status:404})
        }
    
        const newComment = await db?.collection("comments").insertOne({
            content : comment,
            author : new ObjectId(userId),
            post : new ObjectId(postId),
            createdAt:new Date(),
            updatedAt :new Date(),
        });

        if(!newComment?.insertedId){
            return NextResponse.json({
                success:false,
                message :"Failed to add comment"
            },{status:500})
        }

        const updateOperation =  {$push : {comments : newComment.insertedId}} as any;

        const updatedPost = await db?.collection("posts")
        .updateOne(
            {_id : new ObjectId(postId)},
           updateOperation
        )
        
        if(updatedPost?.modifiedCount!== 0){
            return NextResponse.json({
                success:true,
                message :"Comment added successfully"
            },{status:200})
        }else{
            return NextResponse.json({
                success:false,
                message :"Comment not added"
            },{status:400})
        }
    } catch (error) {
        return NextResponse.json({
            success:false,
            message :"Comment post error"
        },{status:500})
    }
}

//GET
export async function GET(req : NextRequest){
    try {
        const {db} = await connectToDB();
        const {postId} = await req.json();
        const userId = req.headers.get("id");
    
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 403 });
        }

        const post = await db?.collection("posts").findOne({_id : new ObjectId(postId)});
    
        if(!post){
            return NextResponse.json({
                success:false,
                message :"Post not found"
            },{status:404})
        }

        const comments = await db?.collection("comments")
        .find({post : new ObjectId(postId)})
        .toArray();

        return NextResponse.json({
            success:true,
            comments 
        },{status:200})
    
    } catch (error) {
        return NextResponse.json({
            success:false,
            message :"Comment get error"
        },{status:500})
    }
}

//DELETE
export async function DELETE(req : NextRequest){
    try {
        const {db} = await connectToDB();
        const {postId,commentId} = await req.json();
        const userId = req.headers.get("id");
    
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 403 });
        }

        const post = await db?.collection("posts").findOne({_id : new ObjectId(postId)});
    
        if(!post){
            return NextResponse.json({
                success:false,
                message :"Post not found"
            },{status:404})
        }

        const comment = await db?.collection("comments").findOne({
            _id: new ObjectId(commentId)
        });

        if (!comment) {
            return NextResponse.json({
                success: false,
                message: "Comment not found"
            }, { status: 404 });
        }

        if (comment.author.toString() !== userId) {
            return NextResponse.json({
                success: false,
                message: "You can only delete your own comments"
            }, { status: 403 });
        }

        const deletedComment = await db?.collection("comments").deleteOne({
            _id : new ObjectId(commentId)
        })

        if(!deletedComment?.deletedCount){
            return NextResponse.json({
                success: false,
                message: "Failed to delete comment"
            }, { status: 500 });
        }

         await db?.collection("posts")
        .updateOne({_id: new ObjectId(postId)},
        {$pull : {comments : new ObjectId(commentId)}} as any
        )


        return NextResponse.json({
            success:true,
            message : "Comment deleted successfully"
        },{status:200})
    
    } catch (error) {
        return NextResponse.json({
            success:false,
            message :"Comment delete error"
        },{status:500})
    }
}


