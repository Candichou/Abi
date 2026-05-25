import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "./schema/auth-schema";
import { eq } from "drizzle-orm";
import { config } from "dotenv";
config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function update() {
  await db
    .update(users)
    .set({ role: "patient" })
    .where(eq(users.email, "f.pop@mail.com"));

  await db
    .update(users)
    .set({ role: "asso" })
    .where(eq(users.email, "nadia.ferreira@cspt75.com"));

  console.log("✅ Rôles mis à jour");
}

update().catch((e) => {
  console.error(e);
  process.exit(1);
});
