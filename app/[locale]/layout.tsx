import type { Metadata } from "next";
import "@/app/globals.css";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { I18nProvider } from "@/lib/i18n/context";
import { LOCALES, type Locale, getLocaleDirection, isLocaleSupported } from "@/lib/i18n/config";
import { ShellLayout } from "@/components/layout/shell-layout";

export const metadata: Metadata = {
  title: "Rentcot Property OS | Multi-Tenant Hospitality Platform",
  description: "Operating system for resorts, farmhouses, camping zones, and vacation stays.",
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
