import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { auth } from "@/app/api/auth/[...nextauth]/configs";
import ClientRootLayout from "./clientRootLayout";
import { Toaster } from "@/components/ui/sonner";
import ProgressWrapper from "@/components/progress-bar/progress-bar-wrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "streamX - Enjoy the world",
  description:
    "streamX is the ultimate platform to enjoy the world with endless entertainment and content.",
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  openGraph: {
    title: "streamX - Enjoy the world",
    description:
      "streamX is the ultimate platform to enjoy the world with endless entertainment and content.",
    siteName: "streamX",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
          async
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider session={session}>
          <ProgressWrapper />
          <ClientRootLayout>{children}</ClientRootLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
