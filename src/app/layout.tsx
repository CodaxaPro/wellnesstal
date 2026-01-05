import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundaryWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  title: "Wellnesstal - Premium Wellness & Headspa in Köln",
  description: "Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!",
  keywords: "wellness, headspa, massage, köln, entspannung, aromatherapie",
  openGraph: {
    title: "Wellnesstal - Premium Wellness & Headspa in Köln",
    description: "Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden.",
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