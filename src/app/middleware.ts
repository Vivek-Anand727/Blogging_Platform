import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { User } from "@/models/user.model";
import { rateLimit } from "./utils/rateLimit";

export async function middleware(req: NextRequest) {
    try {
        // Handle CORS for all API requests
        if (req.method === "OPTIONS") {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        const token = req.cookies.get("token")?.value;
        const userInfo = req.headers.get("authorization")?.split(" ")[1] || null;

        if (!token) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }

        var decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        var { id, email, role } = decodedToken;

        const isRateLimitResult = await rateLimit(id, 10, 60);
        if (!isRateLimitResult.allowed) {
            return NextResponse.json({
                success: false,
                message: "Too many requests"
            }, { status: 429 });
        }

        const isUserValid = await User.findOne({ email });
        const isTokenExpired = decodedToken.exp && (decodedToken.exp * 1000 < Date.now());

        if (!isUserValid || isTokenExpired) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }

        const requestHeader = new Headers(req.headers);
        requestHeader.set("email", email);
        requestHeader.set("id", id);
        requestHeader.set("role", role);

        // Add CORS headers for all API responses
        const response = NextResponse.next({ request: { headers: requestHeader } });
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;
    } catch (error) {
        console.error("Middleware Error:", (error as Error).message);
        const response = NextResponse.redirect(new URL("/signin", req.url));
        response.cookies.set("token", "", { maxAge: 0 });

        // Ensure CORS headers are included even in case of errors
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/api/:path*"]
};
