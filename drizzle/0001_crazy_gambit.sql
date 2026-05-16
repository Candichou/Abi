CREATE TABLE "tag_votes" (
	"user_id" text NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"voted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tag_votes" ADD CONSTRAINT "tag_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_votes" ADD CONSTRAINT "tag_votes_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_votes" ADD CONSTRAINT "tag_votes_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_tag_vote" ON "tag_votes" USING btree ("user_id","practitioner_id","tag_id");