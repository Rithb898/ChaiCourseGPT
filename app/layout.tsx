import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChaiCourseGPT - Your AI Coding Instructor",
  description:
    "Learn coding faster with ChaiCourseGPT - an AI assistant powered by Hitesh Choudhary's teaching style. Get instant help, code examples, and personalized explanations for your course content.",
  keywords:
    "AI coding assistant, programming help, Hitesh Choudhary, coding tutor, learn programming, JavaScript, React, Node.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* <Analytics/> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
