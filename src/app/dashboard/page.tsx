"use client"
import { checkUserSession } from "@/lib/auth";
import Image from "next/image";
import { useAuthExpiration } from "@/hooks/useAuthExpiration";


export default async function Dashboard() {
  useAuthExpiration();
  const session = await checkUserSession();

  if (!session || !session.user) return <p className="text-center text-lg text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-6">
      <div className="bg-white text-black p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>
        <p className="text-lg text-gray-600">{session.user.email}</p>
        
        {session.user.image && (
          <Image 
            src={session.user.image}
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full border-4 border-blue-500 mt-4"
          />
        )}
      </div>
    </div>
  );
}
