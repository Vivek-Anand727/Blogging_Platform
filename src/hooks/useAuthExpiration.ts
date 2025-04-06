"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthExpiration() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); 

      const expiresIn = decodedToken.exp * 1000 - Date.now();
      if (expiresIn <= 0) {
        document.cookie = "token=; max-age=0; path=/;";
        router.push("/signin");
        return;
      }

      const timeout = setTimeout(() => {
        document.cookie = "token=; max-age=0; path=/;";
        router.push("/signin");
      }, expiresIn);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Token Decoding Error:", error);
      document.cookie = "token=; max-age=0; path=/;";
      router.push("/signin");
    }
  }, [router]);
}
