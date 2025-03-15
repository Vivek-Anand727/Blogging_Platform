import { NextRequest , NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/lib/mongodb";
import client from "@/lib/redis";

//DELETION
export async function DELETE(req:NextRequest, { params } :{params : { id:string}} ){
    const {db} = await connectToDB();
    const {id} = params;

    const post = await db?.collection("posts").findOne({_id : new ObjectId(id)});
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });


    const authorUser = req.headers.get("id");
    if(!authorUser || post.author.toString() !== authorUser)
    return NextResponse.json({
        success : false,
        message : "Unauthorized access"
    },{status:403})

    await db?.collection("posts").deleteOne({_id : new ObjectId(id)});

    await client.del("all-posts");
    await client.del(`post-${id}`);

    return NextResponse.json({
        success : true,
        message : "Post deleted successfully"
    },{status:200})
}

//GETTING
export async function GET(req:NextRequest, { params } :{params : { id:string}}){
    const {id} = params;
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

//UPDATION
export async function PUT(req:NextRequest, { params } :{params : { id:string}}){

    const {id} = params;
    const {db} = await connectToDB();
    
    const post = await db?.collection("posts").findOne({_id : new ObjectId(id)}); 
    if(!post){
        return NextResponse.json({
            success:false,
            message: "Post not found"
        },{status:404})
    }

    const {title , content , author} = await req.json();
    if(!(title || content || author)){
        return NextResponse.json({
            success:false,
            message: "Provide valid field(s)"
        },{status:400})
    }

    const authorUser = req.headers.get("id");
    if(!authorUser || post.author.toString() !== authorUser)
    return NextResponse.json({
        success : false,
        message : "Unauthorized access"
    },{status:403});

    const updatedFields : any = {};
    if(title) updatedFields.title = title;
    if(content) updatedFields.content = content;
    if(author) updatedFields.author = author;

    const updatedPost = await db?.collection("posts").findOneAndUpdate(
        {_id:new ObjectId(id)},
        {$set : updatedFields},
        {returnDocument:"after" as any});

    await client.del("all-posts");
    await client.setEx(`post-${id}`,600,JSON.stringify(updatedPost));

    return NextResponse.json({
        success:true,
        message : "Post updated successfully"
    },{status:200})
}