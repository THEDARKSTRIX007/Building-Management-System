import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Building Dashboard",
  description: "Full-stack building management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[linear-gradient(135deg,#0d1117,#1b1f27_50%,#23272f)] text-gray-200">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
