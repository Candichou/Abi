import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/auth";
import type { Role } from "@/lib/validations/role";

export type UsersAll = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: Role | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
};
export async function deleteUser(userId: string): Promise<boolean> {
  const [deleted] = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning({ id: users.id });
  return !!deleted;
}

export async function updateUserRole(
  userId: string,
  role: Role,
): Promise<UsersAll | null> {
  const [user] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId))
    .returning();
  if (!user) return null;
  // La colonne DB est un `text` libre ; on vient de la mettre à jour avec un
  // `Role` validé, donc ce cast est sûr — c'est la frontière où la donnée
  // brute de la DB est traduite vers le type métier.
  return { ...user, role: user.role as Role | null };
}
