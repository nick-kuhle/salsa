import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salsa Social",
  description: "Developed by Nick Kuhle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-gray-900 min-h-screen flex">
          {children}
        </div>
      </body>
    </html>
  );
}
