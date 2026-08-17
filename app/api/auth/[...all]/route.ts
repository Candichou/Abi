import { auth } from "@/lib/auth/config"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { credentialsSchema } from "@/lib/validations/auth";

const { POST: authPost, GET } = toNextJsHandler(auth);

export { GET };

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/auth/sign-up/email") {
    const body = await request.clone().json();
    const result = credentialsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0]?.message ?? "Informations invalides" },
        { status: 400 },
      );
    }
  }

  return authPost(request);
}
