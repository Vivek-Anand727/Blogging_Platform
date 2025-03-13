"use client";
 import { useSession, signIn , signOut} from "next-auth/react";

export default function AuthButton() {

  const {data : session} = useSession();

  if(session?.user){
    return (
      <div className="flex justify-center p-4">
    <button
          onClick={() => signOut()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Log out
        </button>
        </div>
    )
    
  }else{
    return (
      <div className="flex justify-center p-4">
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In-Google
        </button>
        <button
          onClick={() => signIn("github")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In-Github
        </button>  
      </div>
    );
  }
 
}


