"use server";

import { auth } from "@/lib/auth";
import { db } from "@/src/index";
import { users } from "@/src/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function setUserRole(role: "patient" | "asso") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  await db.update(users).set({ role }).where(eq(users.id, session.user.id));
}
