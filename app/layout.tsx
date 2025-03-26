import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
// import { Header } from "./_components";
// import ClientBuildingProvider from "./_components/ClientBuildingProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://soniadacyrela.com.br"), // URL base do seu site
  keywords: [
    "Cyrela",
    "Living",
    "Apartamento",
    "Studio",
    "Apartamentos",
    "Studios",
    "Compra",
    "Venda",
    "Imovel",
    "Imóvel",
    "Imóveis",
    "Lançamento",
    "Na planta",
    "São Paulo",
  ],
  title: {
    default: "Studios e apartamentos",
    template: `%s | Sonia da Cyrela`,
  },
  openGraph: {
    title: "Studios e apartamentos",
    description:
      "Encontre studios e apartamentos Living Cyrela, imóveis nas melhores regiões de São Paulo, planos exclusivos para venda, pronta entrega, lançamentos e na planta.",
  },
};

const philosopher = localFont({
  src: "./fonts/Philosopher-Regular.ttf",
  variable: "--font-philosopher",
});

const cinzel = localFont({
  src: "./fonts/Cinzel-Regular.ttf", // Caminho correto para a fonte
  variable: "--font-cinzel",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.sonadacyrela.com.br" />
        <link rel="icon" href={`${apiPrefix}/favicon.ico`} />
        <meta name="apple-mobile-web-app-title" content="Sonia Cyrela" />
      </head>
      <body
        className={`${philosopher.variable} ${cinzel.variable} antialiased`}
      >
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K4M3ZD4K');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K4M3ZD4K"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Script
          src="https://player.vimeo.com/api/player.js"
          strategy="lazyOnload"
        />
        {/* <ClientBuildingProvider> */}
        {/* <Header /> */}
        {children}
        {/* </ClientBuildingProvider> */}
      </body>
    </html>
  );
}
