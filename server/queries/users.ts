import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/auth";

export type UsersAll = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
};
export async function updateUserRole(
  userId: string,
  role: "patient" | "association",
): Promise<UsersAll | null> {
  const [user] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId))
    .returning();
  if (!user) return null;
  return user;
}
