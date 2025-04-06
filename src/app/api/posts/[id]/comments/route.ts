import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// POST - Add a comment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDB();
    const { comment, postId } = await req.json();
    const userId = req.headers.get("id");
    
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized access"
      }, { status: 403 });
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json({
        success: false,
        message: "Comment text is required"
      }, { status: 400 });
    }

    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json({
        success: false,
        message: "Valid post ID is required"
      }, { status: 400 });
    }

    const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });
    
    if (!post) {
      return NextResponse.json({
        success: false,
        message: "Post not found"
      }, { status: 404 });
    }
    
    const newComment = await db?.collection("comments").insertOne({
      content: comment,
      author: userId,
      post: new ObjectId(postId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!newComment?.insertedId) {
      return NextResponse.json({
        success: false,
        message: "Failed to add comment"
      }, { status: 500 });
    }

    const updateOperation = { $push: { comments: newComment.insertedId } } as any;
    
    const updatedPost = await db?.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      updateOperation
    );
    
    if (updatedPost?.modifiedCount === 0) {
      await db?.collection("comments").deleteOne({ _id: newComment.insertedId });
      
      return NextResponse.json({
        success: false,
        message: "Comment not added to post"
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Comment added successfully",
      commentId: newComment.insertedId
    }, { status: 201 });  
    
  } catch (error) {
    console.error("Comment POST error:", error);
    return NextResponse.json({
      success: false,
      message: "Comment post error"
    }, { status: 500 });
  }
}

// GET - Retrieve comments for a post
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDB();
    const postId = (await params).id;
        
    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json({
        success: false,
        message: "Invalid post ID"
      }, { status: 400 });
    }

    const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });
    
    if (!post) {
      return NextResponse.json({
        success: false,
        message: "Post not found"
      }, { status: 404 });
    }

    const comments = await db?.collection("comments")
      .find({ post: new ObjectId(postId) })
      .sort({ createdAt: -1 }) 
      .toArray();

    console.log(`Found ${comments?.length} comments`);
    
    return NextResponse.json({
      success: true,
      comments
    }, { status: 200 });
    
  } catch (error) {
    console.error("Comments GET error:", error);
    return NextResponse.json({
      success: false,
      message: "Comment get error"
    }, { status: 500 });
  }
}

// DELETE - Remove a comment
export async function DELETE(req: NextRequest) {
  try {
    const { db } = await connectToDB();
    const { postId, commentId } = await req.json();
    const userId = req.headers.get("id");
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized access"
      }, { status: 403 });
    }

    if (!commentId || !ObjectId.isValid(commentId)) {
      return NextResponse.json({
        success: false,
        message: "Valid comment ID is required"
      }, { status: 400 });
    }

    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json({
        success: false,
        message: "Valid post ID is required"
      }, { status: 400 });
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
      _id: new ObjectId(commentId)
    });

    if (!deletedComment?.deletedCount) {
      return NextResponse.json({
        success: false,
        message: "Failed to delete comment"
      }, { status: 500 });
    }

    await db?.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { comments: new ObjectId(commentId) } } as any
    );

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully"
    }, { status: 200 });
    
  } catch (error) {
    console.error("Comment delete error:", error);
    return NextResponse.json({
      success: false,
      message: "Comment delete error"
    }, { status: 500 });
  }
}