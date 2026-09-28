import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prompt to Production — Paytm AI Workshop | NBKRIST",
  description:
    "A hands-on workshop to explore Generative AI, Prompt Engineering, and AI-assisted Development with industry leaders from Paytm and Microsoft. Organized by the Department of IT & AI&DS, N.B.K.R. Institute of Science & Technology in association with ISTE.",
  keywords: [
    "Prompt to Production",
    "Paytm AI Workshop",
    "NBKRIST",
    "N.B.K.R. Institute of Science & Technology",
    "Department of IT & AI&DS",
    "ISTE Student Chapter",
    "Vidyanagar",
    "Generative AI",
    "Prompt Engineering",
    "Microsoft",
    "Paytm",
  ],
  authors: [{ name: "Department of IT & AI&DS, NBKRIST" }],
  creator: "NBKRIST & ISTE",
  openGraph: {
    title: "Prompt to Production — Paytm AI Workshop",
    description:
      "Hands-on Generative AI & Prompt Engineering workshop with industry leaders from Paytm and Microsoft on 30 September 2026 at Seminar Hall, New CSE Block, NBKRIST.",
    type: "website",
    locale: "en_IN",
    siteName: "NBKRIST Prompt to Production",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt to Production — Paytm AI Workshop",
    description: "30 September 2026 • Hands-on AI Workshop at NBKRIST Vidyanagar",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#002970",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fontSans.variable} ${fontMono.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-[#FAFBFD] selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
