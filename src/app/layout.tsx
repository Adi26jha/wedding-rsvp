import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#FAF7F2",
};

export const metadata: Metadata = {
  title: "Priyal & Justin | Wedding Invitation & RSVP",
  description:
    "We joyfully invite you to celebrate the wedding of Priyal & Justin at Corbett Adventure Resort, Bail Parao, Uttarakhand on 21st & 22nd November 2026.",
  // Security & Privacy: Never index the private wedding portal on search engines
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "Priyal & Justin — Wedding Invitation",
    description:
      "Join our wedding celebrations at Corbett Adventure Resort, Uttarakhand on 21st & 22nd November 2026. Please RSVP your attendance.",
    type: "website",
    locale: "en_IN",
    siteName: "Priyal & Justin Wedding Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyal & Justin — Wedding Invitation",
    description: "21st - 22nd November 2026 | Corbett Adventure Resort, Uttarakhand",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="bg-ivory text-charcoal-900 antialiased selection:bg-maroon-700 selection:text-ivory-50">
        {children}
      </body>
    </html>
  );
}
