CREATE EXTENSION IF NOT EXISTS unaccent;
--> statement-breakpoint
ALTER TABLE "practitioners" ADD COLUMN "postal_code" varchar(10);