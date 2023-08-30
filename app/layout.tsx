import { Inter } from "next/font/google";
import ModalProvider from "@/components/providers/ModalProvider";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ModalProvider />
            <Toaster />
            {children}
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
