import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { HeroHeader } from "@/components/header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StatJunkie - Live Scores & Stats",
  description: "Real-time NBA scores and player statistics",
  icons: {
    icon: "/statjunkie-high-resolution-logo-transparent.png",
    apple: "/statjunkie-high-resolution-logo-transparent.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HeroHeader />
          {/* FIX: The pt-20 class clears the fixed HeroHeader (main Navbar). */}
          <main className="pt-20">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
