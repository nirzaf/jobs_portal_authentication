import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HydrationSafeClerkProvider from "@/components/providers/HydrationSafeClerkProvider";
import Navigation from "@/components/layout/Navigation";
import ClientOnly from "@/components/common/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobs Portal - Find Your Dream Job",
  description: "Connect job seekers with employers. Find your next opportunity or hire the best talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <HydrationSafeClerkProvider>
          <ClientOnly
            fallback={
              <nav className="bg-white shadow-lg border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-900">Jobs Portal</span>
                    </div>
                    <div className="flex items-center">
                      <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                    </div>
                  </div>
                </div>
              </nav>
            }
            suppressHydrationWarning
          >
            <Navigation />
          </ClientOnly>
          {children}
        </HydrationSafeClerkProvider>
      </body>
    </html>
  );
}
