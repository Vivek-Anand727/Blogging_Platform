import { NextRequest, NextResponse } from "next/server";
import { Redirect } from "next/dist/types";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { User } from "@/models/user.model";
import { rateLimit } from "./utils/rateLimit";

export async function middleware (req : NextRequest){
    try {
        const token =  req.cookies.get("token")?.value;
        
        const userInfo = req.headers.get("authorization")?.split(" ")[1] || null ;

        if(!token){
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    
        var decodedToken = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;
        var {id , email} = decodedToken;

        const isRateLimitResult = await rateLimit(id,10,60);
        if(!isRateLimitResult.allowed){
            return NextResponse.json({
                success : false,
                message : "Too many requests"
            },{status:429})
        }
    
        const isUserValid = await User.findOne({email});
        const isTokenExpired = decodedToken.exp && (decodedToken.exp * 1000 < Date.now());
        if (!isUserValid || isTokenExpired) {
            return NextResponse.redirect(new URL("/signin",req.url));
        }
        
        const requestHeader = new Headers(req.headers);
        requestHeader.set("email",email);
        requestHeader.set("id",id);
        
        return NextResponse.next({request : {headers : requestHeader }});
        
    } catch (error) {
        console.error("Midddleware problem",(error as Error).message );
        const response = NextResponse.redirect(new URL("/signin", req.url));
        response.cookies.set("token", "", { maxAge: 0 }); 
        return response;    
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/api/posts/:path*"]
};
