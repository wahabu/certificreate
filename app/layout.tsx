import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const certificateSerif = Cormorant_Garamond({
  variable: "--font-certificate-serif-loaded",
  subsets: ["latin"],
  weight: ["400"],
});

const certificateSans = Montserrat({
  variable: "--font-certificate-sans-loaded",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Certificreate | Certificate Studio",
  description: "Create polished, on-brand certificates locally.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${certificateSerif.variable} ${certificateSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
