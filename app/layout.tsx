import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import heroData from "@/data/hero.json";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: heroData.meta.title,
  description: heroData.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var l=t==="light"||(t==null&&window.matchMedia("(prefers-color-scheme: light)").matches);if(l)document.documentElement.classList.add("light")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-mono" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
