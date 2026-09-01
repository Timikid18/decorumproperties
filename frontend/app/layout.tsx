import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistDisplay = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-display",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "DECORUM HOMES & PROPERTIES",
    template: "%s | DECORUM HOMES & PROPERTIES",
  },
  description:
    "Buy, sell, and own properties, vehicles, gadgets, and appliances — DECORUM makes the marketplace simple.",
  metadataBase: new URL("https://decorumproperties.ng"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("decorum-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.dataset.theme="dark"}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistDisplay.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}