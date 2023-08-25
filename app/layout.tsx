import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import ModalProvider from "@/components/providers/ModalProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard - Reserved",
  description: "Admin Dashboard for control your store.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <ModalProvider />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
