import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ user: { id: (session.user as any).id, ...session.user } });
}
