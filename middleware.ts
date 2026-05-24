// middleware.ts (à la racine du projet)

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const session = await getSessionFromRequest(request);

  // 1️⃣ Protéger /app/* — besoin d'une session
  if (url.pathname.startsWith("/app")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // 2️⃣ Protéger /auth/* — si connecté, rediriger vers dashboard
  if (url.pathname.startsWith("/auth")) {
    if (session) {
      return NextResponse.redirect(
        new URL("/app/dashboard/userPatient", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/auth/:path*"],
};
