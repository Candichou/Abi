"use server";

import { auth } from "@/lib/auth/config";
import { db } from "@/server/db/index";
import { users } from "@/server/db/schema/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function setUserRole(role: "patient" | "asso") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  await db.update(users).set({ role }).where(eq(users.id, session.user.id));
}
