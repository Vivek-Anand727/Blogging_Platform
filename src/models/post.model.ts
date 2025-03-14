import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true,
        uppercase : true
    },
    content:{
        type : String,
        required : true,
    },
    author:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    tags: {
        type: [String],
        enum: ["sports","travel","entertainment","technology","health","education","food","fashion","business","lifestyle","news","others"],
        default: "others"
    }
    
},{timestamps : true})

export const Post = mongoose.model("Post", postSchema)
