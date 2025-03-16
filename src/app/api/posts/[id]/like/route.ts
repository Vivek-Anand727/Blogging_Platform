import { connectToDB } from "@/lib/mongodb";
import {NextRequest,NextResponse} from "next/server"
import { ObjectId } from "mongodb"; 


export async function PATCH(req:NextRequest){
    try {
        const {db} = await connectToDB();
        const userId: any =  req.headers.get("id");
        const {postId} = await req.json();
    
        if (!userId || !postId) {
            return NextResponse.json({
                 success: false,
                  message: "User ID and Post ID are required"
                 }, { status: 400 });
        }
    
        if (!ObjectId.isValid(postId) || !ObjectId.isValid(userId)) {
            return NextResponse.json({
                 success: false,
                  message: "Invalid Post ID or User ID"
                 }, { status: 400 });
        }

        const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });
        if (!post) {
            return NextResponse.json({ 
                success: false, 
                message: "Post not found"
             }, { status: 404 });
        }

        const alreadyLiked = post.likedBy?.some((id: ObjectId) => id.equals(new ObjectId(userId)));
        if (alreadyLiked) {
            return NextResponse.json({ 
                success: false, 
                message: "Already liked"
             }, { status: 400 });
        }

        const updatedPost = await db?.collection("posts").updateOne(
            { _id: new ObjectId(postId) },
            {
                $addToSet: { likedBy: new ObjectId(userId) }, 
                $inc: { likes: 1 }
            }
        );

        if (updatedPost?.modifiedCount === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Post like failed"
             }, { status: 500 });
        }

        const updatedPostData = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });
        return NextResponse.json({
             success: true,
              message: "Post liked successfully",
              likes: updatedPostData?.likes || 0
            },{ status: 200 });

    } catch (error) {
        console.error("LIKE ERROR", error);
        return NextResponse.json({ 
            success: false, 
            message: "Failed to like post"
         }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    try {
      const { db } = await connectToDB();
      const userId: any = req.headers.get("id");
      const { postId } = await req.json();
      
      if (!userId || !postId) {
        return NextResponse.json({
          success: false, 
          message: "User ID and Post ID are required"
        }, { status: 400 });
      }
      
      if (!ObjectId.isValid(postId) || !ObjectId.isValid(userId)) {
        return NextResponse.json({
          success: false, 
          message: "Invalid Post ID or User ID"
        }, { status: 400 });
      }
      
      const post = await db?.collection("posts").findOne({ _id: new ObjectId(postId) });
      if (!post) {
        return NextResponse.json({
          success: false,
          message: "Post not found"
        }, { status: 404 });
      }
      
      const updateOperation = {
        $pull: { likedBy: new ObjectId(userId) },
        $inc: { likes: post.likes > 0 ? -1 : 0 }
      } as any; 
      
      const updatedPost = await db?.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        updateOperation
      );
      
      if (updatedPost?.modifiedCount === 0) {
        return NextResponse.json({
          success: false,
          message: "Post unlike failed"
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: "Post unliked successfully"
      }, { status: 201 });
    } catch (error) {
      console.error("UNLIKE ERROR", error);
      return NextResponse.json({
        success: false,
        message: "Failed to unlike post"
      }, { status: 500 });
    }
  }