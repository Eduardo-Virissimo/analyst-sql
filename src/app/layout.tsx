import type { Metadata, Viewport } from "next";
import { Fredoka, Geist_Mono, Rubik } from "next/font/google";
import "./globals.css";

// Títulos em Fredoka (arredondada e encorpada, como o gato do ícone); texto em Rubik (cantos levemente
// arredondados, firme e legível em tamanho pequeno); busca (SQL) e números em Geist Mono.
const heading = Fredoka({ subsets: ["latin"], variable: "--font-heading" });
const body = Rubik({ subsets: ["latin"], variable: "--font-body" });
const code = Geist_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  title: "analyst-sql",
  applicationName: "analyst-sql",
  description:
    "Pergunte ao seu banco de dados em português. O analyst-sql escreve o SQL, confere, executa em modo somente leitura e explica o resultado.",
};

export const viewport: Viewport = {
  themeColor: "#f4efff",
  colorScheme: "light",
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
