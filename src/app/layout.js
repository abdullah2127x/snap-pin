import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Nevigation from "@/components/Nevigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SnapPin - Your Ultimate URL Shortener",
  description: "Simplify your links and share them effortlessly with SnapPin. Fast, reliable, and user-friendly URL shortening.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body className={inter.className}>
          <Nevigation>{children}</Nevigation>
        </body>
      </SessionWrapper>
    </html>
  );
}
// testing