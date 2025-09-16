// Em app/layout.js
import { Poppins } from "next/font/google";
import Script from 'next/script'; // Importe o componente Script
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "JuroSmart | Calculadora de Juros Compostos",
  description:
    "Simule seus investimentos e veja o poder dos juros compostos em ação.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5245805097376724"
     crossorigin="anonymous"></script>
      </head>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}