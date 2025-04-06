import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const { db } = await connectToDB();
    const body = await req.json();
    console.log("Received body:", body);

    const { postId, userId } = body;
    if (!userId || !postId) {
      return NextResponse.json({ success: false, message: "User ID and Post ID are required" }, { status: 400 });
    }

    const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    // ✅ Ensure idempotency: No error if user already liked
    const alreadyLiked = post.likedBy?.some((id: string) => id.toString() === userId);
    if (!alreadyLiked) {
      await db?.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $addToSet: { likedBy: userId }, $inc: { likes: 1 } }
      );
    }

    return NextResponse.json({ success: true, likes: post.likes + (alreadyLiked ? 0 : 1) });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ success: false, message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { db } = await connectToDB();
    const body = await req.json();
    console.log("Received body:", body);

    const { postId, userId } = body;
    console.log("Post ID:", postId, "User ID:", userId);

    if (!userId || !postId) {
      console.error("Validation failed: User ID or Post ID is missing");
      return NextResponse.json(
        { success: false, message: "User ID and Post ID are required" },
        { status: 400 }
      );
    }

    const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });
    console.log("Post found:", post);

    if (!post) {
      console.error("Post not found");
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    console.log("Current likedBy list:", post.likedBy);
    const alreadyLiked = post.likedBy?.some((id: string) => id.toString() === userId);
    
    if (!alreadyLiked) {
      console.warn("User hasn't liked this post");
      return NextResponse.json({ success: false, message: "You haven't liked this post" }, { status: 400 });
    }

    const updatedPost = await db?.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likedBy: userId }, $inc: { likes: -1 } }
    );

    console.log("Update result:", updatedPost);
    if (updatedPost?.modifiedCount === 0) {
      console.error("Failed to unlike post");
      return NextResponse.json({ success: false, message: "Failed to unlike post" }, { status: 500 });
    }

    return NextResponse.json({ success: true, likes: Math.max((post.likes || 0) - 1, 0) });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

