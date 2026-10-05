import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Central BTS Coreia · Rose Freitas",
  description: "Notícias do BTS na imprensa coreana, com buscas no Daum e links para tradução.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
