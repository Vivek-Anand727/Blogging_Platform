import { SessionProvider } from "next-auth/react";
import Layout from "./components/shared/Layout";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./globals.css";
import AuthProvider from "./components/providers/SessionProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Layout>
          <AuthProvider>
            {children}
            </AuthProvider>
            </Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
