import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "Wellnesstal - Premium Wellness & Headspa in Köln",
  description: "Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!",
  keywords: "wellness, headspa, massage, köln, entspannung, aromatherapie",
  openGraph: {
    title: "Wellnesstal - Premium Wellness & Headspa in Köln",
    description: "Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden.",
    images: ["/images/og-wellnesstal.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}