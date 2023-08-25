import { Inter } from "next/font/google";
import ModalProvider from "@/components/providers/ModalProvider";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/Toaster";

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
  // const queryClient = new QueryClient();

  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <ModalProvider />
          <Toaster/>
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
