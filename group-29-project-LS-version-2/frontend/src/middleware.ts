import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const adminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const adminApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/");
  const needsLogin = adminPage || pathname === "/account" || pathname.startsWith("/account/") || pathname === "/bookings" || pathname.startsWith("/bookings/");
  const token = needsLogin ? await getToken({ req: request, secret: process.env.AUTH_SECRET }) : null;

  if (needsLogin && !token?.sub) {
    if (adminApi) return Response.json({ error: { code: "AUTHENTICATION_REQUIRED", message: "Please sign in." } }, { status: 401 });
    const login = new URL("/login", request.url);
    login.searchParams.set("returnTo", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  if ((adminPage || adminApi) && token?.role === "GUEST") {
    if (adminApi) return Response.json({ error: { code: "FORBIDDEN", message: "You do not have access to this resource." } }, { status: 403 });
    return NextResponse.rewrite(new URL("/forbidden", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/account/:path*", "/bookings/:path*"] };
