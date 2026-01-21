import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata, Viewport } from "next";

import "./globals.css";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundaryWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3001'),
  title: "Wellnesstal - Premium Wellness & Headspa in Baesweiler | Massage & Entspannung",
  description: "Professionelle Wellness & Headspa-Behandlungen in Baesweiler. Japanische Kopfmassage, Entspannung & Massage für Ihr Wohlbefinden. Jetzt Termin vereinbaren!",
  keywords: "wellness baesweiler, headspa baesweiler, massage baesweiler, japanische kopfmassage, entspannung baesweiler, wellness studio, spa baesweiler",
  openGraph: {
    title: "Wellnesstal - Premium Wellness & Headspa in Baesweiler | Massage & Entspannung",
    description: "Professionelle Wellness & Headspa-Behandlungen in Baesweiler. Japanische Kopfmassage, Entspannung & Massage für Ihr Wohlbefinden.",
    images: ["/images/og-wellnesstal.jpg"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundaryWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
