import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Aktywacja - Ptak Warsaw Expo",
  description: "Aktywacja QR code przed targami",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
