import type { Metadata } from "next";
import "@/app/globals.css";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { I18nProvider } from "@/lib/i18n/context";
import { LOCALES, type Locale, getLocaleDirection, isLocaleSupported } from "@/lib/i18n/config";
import { ShellLayout } from "@/components/layout/shell-layout";

export const metadata: Metadata = {
  metadataBase: new URL("https://rentcot.com"),
  title: {
    default: "Rentcot Property OS | Operating System for Resorts, Farmhouses & Camping",
    template: "%s | Rentcot Property OS",
  },
  description:
    "The all-in-one multi-tenant hospitality operating system for luxury resorts, private farmhouses, eco retreats, and glamping sites. 2-way OTA sync, GST invoicing POS, dynamic surge pricing, and live campsite management.",
  keywords: [
    "resort management software",
    "farmhouse booking system",
    "camping management platform",
    "glamping reservation software",
    "hospitality property OS",
    "channel manager airbnb booking.com makemytrip",
    "front-desk POS GST invoice",
    "dynamic pricing engine for resorts",
    "rate parity checker",
    "multi-tenant PMS",
  ],
  authors: [{ name: "Rentcot Hospitality Technologies" }],
  creator: "Rentcot Property OS",
  publisher: "Dodail Solutions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rentcot.com",
    siteName: "Rentcot Property OS",
    title: "Rentcot Property OS — Smart Platform for Resorts, Farmhouses & Campsites",
    description:
      "Automate bookings, eliminate double-bookings across OTAs, run front-desk POS with custom resort branding, and manage outdoor camping retreats in one unified platform.",
    images: [
      {
        url: "/brand/rentcot-logo.png",
        width: 800,
        height: 280,
        alt: "Rentcot Property OS Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentcot Property OS | Multi-Tenant Hospitality Platform",
    description:
      "Operating system for resorts, farmhouses, camping zones, and vacation stays. 2-Way OTA sync, dynamic pricing, and branded POS invoicing.",
    images: ["/brand/rentcot-logo.png"],
  },
  icons: {
    icon: "/brand/rentcot-icon.png",
    apple: "/brand/rentcot-icon.png",
  },
};

export async function generateStaticParams() {
  return LOCALES.map((l) => ({ locale: l.code }));
}

export default async function RootLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const currentLocale: Locale = isLocaleSupported(params.locale) ? params.locale : "en";
  const dict = await getDictionary(currentLocale);
  const dir = getLocaleDirection(currentLocale);

  return (
    <html lang={currentLocale} dir={dir} className="h-full">
      <body className="h-full antialiased bg-background text-foreground font-sans">
        <I18nProvider locale={currentLocale} dict={dict}>
          <ShellLayout>{children}</ShellLayout>
        </I18nProvider>
      </body>
    </html>
  );
}
