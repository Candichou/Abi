import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./db/schema/auth-schema";
import * as appSchema from "./db/schema/app";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({
  client: sql,
  schema: { ...authSchema, ...appSchema },
});
