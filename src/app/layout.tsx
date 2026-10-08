import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/inter";
import { SITE } from "@/lib/site";
import { getContent } from "@/lib/content";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Constructora e Inmobiliaria 4:44 | Casas y departamentos en Guadalajara",
    template: "%s | Constructora 4:44",
  },
  description: SITE.description,
  keywords: [
    "constructora en Guadalajara",
    "inmobiliaria Guadalajara",
    "departamentos en venta Guadalajara",
    "casas en venta Zapopan",
    "desarrollo inmobiliario Guadalajara",
    "construcción de casas Guadalajara",
    "crowdfunding inmobiliario México",
    "Constructora 444",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE.url,
    siteName: SITE.name,
    title: "Constructora 4:44 | Construimos lo que permanece",
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { company } = await getContent();
  const sameAs = [company.facebook, company.instagram && `https://instagram.com/${company.instagram}`].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "RealEstateAgent"],
    name: SITE.name,
    alternateName: "Constructora 444",
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    image: `${SITE.url}/logo.svg`,
    description: SITE.description,
    slogan: SITE.tagline,
    ...(company.phone ? { telephone: company.phone } : {}),
    ...(company.email ? { email: company.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    areaServed: { "@type": "City", name: "Guadalajara" },
    address: { "@type": "PostalAddress", addressLocality: "Guadalajara", addressRegion: "Jalisco", addressCountry: "MX" },
  };
  return (
    <html lang="es-MX" className="antialiased">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
