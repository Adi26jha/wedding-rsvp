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
  title: "Priyal & Justin | Wedding RSVP",
  description:
    "Kindly RSVP for the wedding celebrations of Priyal & Justin at Corbett Adventure Resort, Bail Parao, Uttarakhand on 21st & 22nd November 2026.",
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
    title: "Priyal & Justin — Wedding RSVP",
    description:
      "Confirm your RSVP for our wedding celebrations at Corbett Adventure Resort, Uttarakhand on 21st & 22nd November 2026.",
    type: "website",
    locale: "en_IN",
    siteName: "Priyal & Justin Wedding RSVP Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyal & Justin — Wedding RSVP",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var removeNetlifyBadge = function() {
                  var badge = document.getElementById("nl-badge-frame") ||
                              document.getElementById("nl-hud-frame") ||
                              document.querySelector('iframe[title="Powered by Netlify"]') ||
                              document.querySelector('iframe[title="Netlify"]') ||
                              document.querySelector('script[data-nf-variant]');
                  if (badge && badge.parentNode) {
                    badge.parentNode.removeChild(badge);
                  }
                };
                if (typeof MutationObserver !== "undefined") {
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var added = mutations[i].addedNodes;
                      for (var j = 0; j < added.length; j++) {
                        var node = added[j];
                        if (!node || !node.tagName) continue;
                        if (
                          node.id === "nl-badge-frame" ||
                          node.id === "nl-hud-frame" ||
                          (node.tagName === "IFRAME" && (node.title === "Powered by Netlify" || node.title === "Netlify")) ||
                          (node.tagName === "SCRIPT" && node.getAttribute && node.getAttribute("data-nf-variant"))
                        ) {
                          if (node.parentNode) node.parentNode.removeChild(node);
                        }
                      }
                    }
                  });
                  observer.observe(document.documentElement, { childList: true, subtree: true });
                }
                window.addEventListener("DOMContentLoaded", removeNetlifyBadge);
                window.addEventListener("load", removeNetlifyBadge);
              })();
            `,
          }}
        />
      </head>
      <body className="bg-ivory text-charcoal-900 antialiased selection:bg-maroon-700 selection:text-ivory-50">
        {children}
      </body>
    </html>
  );
}
