import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function getSessionData(){ 
    return await getServerSession(authOptions);
}



import { redirect } from "next/navigation";

export async function checkUserSession() {
  const user  = await getSessionData();
  if (!user) {
    redirect("/api/auth/signin");
  } else {
    return user;
  }
}
