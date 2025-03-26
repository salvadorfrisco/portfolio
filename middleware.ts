import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/clientes") ||
    request.nextUrl.pathname.startsWith("/api/clients");

  if (isProtectedRoute) {
    const authCookie = request.cookies.get("auth");
    if (!authCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/clientes/:path*", "/api/clients/:path*"],
};
