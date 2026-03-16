import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Jack Ma — Software Engineer | Creator | Builder",
  description:
    "Portfolio of Jack Ma — Software Engineer, 3D printing enthusiast, rotary engine lover, and creative builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
