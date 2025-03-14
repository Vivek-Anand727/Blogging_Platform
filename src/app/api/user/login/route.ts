import { connectToDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req : NextRequest){

    try { 
        await connectToDB();

        const {email , password} = await req.json();
        if( !email || !password){
            return NextResponse.json({
                success : false,
                message : "Both email & password required"
            })
        }

        const user = await User.findOne({email});
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User does not exist. Redirect to register",
                redirectTo: "/register"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return NextResponse.json({
                success: false,
                message :"Incorrect password" 
            },{status : 400})
        }

        const token = jwt.sign(
            {id : user._id, email:user.email},
            process.env.JWT_SECRET!,
            {expiresIn : "1h"}
         );
         
          (await cookies()).set("token",token, {
            httpOnly : true,
            sameSite: "strict",
            path:"/",
            maxAge : 3600
          });

          return NextResponse.json({
            success: true,
            message: "Login successful"
        });
    
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                message: "Server error", error : (error as Error).message
            },
            { status: 500 }
        );
    }

}