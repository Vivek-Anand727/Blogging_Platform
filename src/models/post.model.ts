import mongoose, { Schema } from "mongoose";
import { Comment } from "./comment.model";
import slugify from "slugify";


const postSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true,
        uppercase : true
    },
    slug: {
        type: String,
        unique: true,
        required: true
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
    },
    image:{
        type: String,
        default:"https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"  
    },
    status:{
        type : String,
        enum : ["draft","published"],
        default : "draft"
    },
    views:{
        type : Number,
        default : 0
    },
    likes:{
        type : Number,
        default : 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    comments:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"    
    }]


    
},{timestamps : true})


postSchema.pre("validate", async function (next) {
    if (this.isModified("title") || this.isNew) {
        this.slug = slugify(this.title, { lower: true, strict: true });

        let existingPost = await mongoose.models.Post.findOne({ slug: this.slug });
        let counter = 1;
        while (existingPost) {
            this.slug = `${slugify(this.title, { lower: true, strict: true })}-${counter}`;
            existingPost = await mongoose.models.Post.findOne({ slug: this.slug });
            counter++;
        }
    }
    next();
});



export const Post = mongoose.model("Post", postSchema)
