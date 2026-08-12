ALTER TABLE "practitioner_associations" DROP CONSTRAINT "practitioner_associations_validated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "practitioner_consent_requests" DROP CONSTRAINT "practitioner_consent_requests_sent_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "practitioners" DROP CONSTRAINT "practitioners_proposed_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "practitioners" DROP CONSTRAINT "practitioners_validated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "practitioner_consent_requests" ALTER COLUMN "sent_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "practitioner_associations" ADD CONSTRAINT "practitioner_associations_validated_by_users_id_fk" FOREIGN KEY ("validated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_consent_requests" ADD CONSTRAINT "practitioner_consent_requests_sent_by_users_id_fk" FOREIGN KEY ("sent_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_proposed_by_users_id_fk" FOREIGN KEY ("proposed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_validated_by_users_id_fk" FOREIGN KEY ("validated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;