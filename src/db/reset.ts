// src/db/reset.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  tags,
  associations,
  practitioners,
  practitionerTags,
  practitionerAssociations,
} from "./schema/app";
import { config } from "dotenv";
config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function reset() {
  await db.delete(practitionerTags);
  await db.delete(practitionerAssociations);
  await db.delete(practitioners);
  await db.delete(associations);
  await db.delete(tags);
  console.log("✅ Reset completed");
}

reset().catch((e) => {
  console.error(e);
  process.exit(1);
});
