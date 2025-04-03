"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function AuthButton() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCustomSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      // Optionally redirect or handle successful login
      window.location.href = "/dashboard"; // Example redirect after successful login
    }
  };

  if (session?.user) {
    return (
      <div className="flex justify-center p-4">
        <button
          onClick={() => signOut()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Log out
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center p-4">
        {/* Google Sign In */}
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Sign In with Google
        </button>
        
        {/* GitHub Sign In */}
        <button
          onClick={() => signIn("github")}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Sign In with GitHub
        </button>

        {/* Custom Email/Password Login */}
        <form onSubmit={handleCustomSignIn} className="mt-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-gray-200 p-2 rounded"
              required
            />
          </div>
          <div className="mt-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-gray-200 p-2 rounded"
              required
            />
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Sign In with Email/Password
          </button>
        </form>
      </div>
    );
  }
}
