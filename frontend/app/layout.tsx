import type { Metadata } from "next";
import { Quicksand, Nunito } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { SITE } from "@/lib/constants/site";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Hachuw",
    "freelance illustrator",
    "commission",
    "digital art",
    "anime art",
    "illustration",
  ],
  authors: [{ name: SITE.creator.name }],
  creator: SITE.creator.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  icons: {
    icon: [
      { url: "/icon.png?v=2", type: "image/png" },
    ],
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
      // JSON-LD structured data untuk SEO.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.creator.name,
    alternateName: SITE.name,
    jobTitle: SITE.creator.role,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}/opengraph-image`,
    sameAs: [
      "https://x.com/hachu_w",
      "https://www.instagram.com/hachu_w/",
      "https://www.facebook.com/raihanun.a.hanan",
      "https://discord.com/users/800943996180496385",
      "https://trakteer.id/Hachuw",
      "https://vgen.co/hachu_w",
    ],
  };

  return (
    <html
      lang="id"
      className={`${quicksand.variable} ${nunito.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream-50 text-ink-800">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}