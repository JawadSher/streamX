import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import ClientRootLayout from "./clientRootLayout";
import { Toaster } from "@/components/ui/sonner";
import ProgressWrapper from "@/components/progress-bar/progress-bar-wrapper";
import QueryProvider from "@/context/QueryProvider";
import { ApoloProvider } from "@/context/ApolloProvider";
import { UserProvider } from "@/context/UserProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Watch Videos Online | streamX",
  description: "Watch free videos, movies and shows on streamX.",
  robots: "index, follow",
  openGraph: {
    title: "streamX - Enjoy the world",
    description:
      "streamX is the ultimate platform to enjoy the world with endless entertainment and content.",
    siteName: "streamX",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <ProgressWrapper />
          <ClientRootLayout>
            <QueryProvider>
              <ApoloProvider>
                <UserProvider />
                {children}
              </ApoloProvider>
            </QueryProvider>
          </ClientRootLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
