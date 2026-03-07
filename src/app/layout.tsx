import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GymLogger",
  description: "Track your workouts and progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-m3-background text-m3-text-main`}
      >
        <ClerkProvider>
          <header className="flex justify-end items-center gap-4 p-4 border-b border-m3-surface-variant bg-m3-surface">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="bg-m3-primary text-m3-background px-4 py-2 rounded-m3-btn font-bold hover:opacity-90 transition-opacity">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-m3-surface-variant text-m3-text-main px-4 py-2 rounded-m3-btn font-bold hover:bg-m3-surface transition-colors border border-m3-surface-variant">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}