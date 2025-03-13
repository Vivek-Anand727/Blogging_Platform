"use client"
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import AuthButton from "./components/AuthButtons";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthButton />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
