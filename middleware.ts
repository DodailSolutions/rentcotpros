import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { LOCALES, DEFAULT_LOCALE, isLocaleSupported } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public files, next static files, and api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return await updateSession(request);
  }

  // Check if pathname has a supported locale prefix
  const pathnameLocale = pathname.split("/")[1];
  const hasLocale = isLocaleSupported(pathnameLocale);

  if (!hasLocale) {
    // Check if user has a preferred locale in cookies
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const targetLocale = (cookieLocale && isLocaleSupported(cookieLocale)) ? cookieLocale : DEFAULT_LOCALE;

    const redirectUrl = new URL(`/${targetLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
