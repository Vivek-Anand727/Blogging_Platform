import { connectToDB } from "@/lib/mongodb";
import { User } from "../../../../models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { name, email, password } = await req.json(); 

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Email, name & password are required!" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        await User.create({ name, email, password: hashedPassword });

        return NextResponse.json(
            { success: true, message: "User registered successfully" },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error", error : (error as Error).message},
            { status: 500 }
        );
    }
}
