import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Títulos em serifa; texto em sans neutra; marca e dados em mono.
const heading = Source_Serif_4({ subsets: ["latin"], variable: "--font-heading" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  title: "analyst-sql",
  applicationName: "analyst-sql",
  description:
    "Pergunte ao seu banco de dados em português. O analyst-sql escreve o SQL, confere, executa em modo somente leitura e explica o resultado.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${heading.variable} ${body.variable} ${code.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
