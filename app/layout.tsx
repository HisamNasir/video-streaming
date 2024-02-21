import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavBar from "./ui/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video",
  description: "Video Streaming Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="fixed w-full bg-opacity-5">
            <NavBar />
          </div>
          <div className="h-[calc(100vh-64px)] pt-[80px] p-4 max-w-7xl mx-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
