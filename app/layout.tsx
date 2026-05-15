import type { Metadata } from "next";
import { Manrope, Noto_Sans } from "next/font/google"; // eslint-disable-line @typescript-eslint/no-unused-vars
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Accthive - Digital Service Platform",
  description:
    "Elevate your digital presence with premium social boosting, verified accounts, instant SMS verification, and global gifting solutions.",
  other: {
    heleket: "29332002",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${manrope.variable} ${notoSans.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="language" content="Vietnamese" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
