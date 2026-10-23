CREATE TYPE "public"."option_key" AS ENUM('A', 'B', 'C', 'D', 'E');--> statement-breakpoint
CREATE TYPE "public"."track" AS ENUM('primary', 'final');--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" text PRIMARY KEY NOT NULL,
	"track" "track" NOT NULL,
	"title" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mcq_options" (
	"mcq_id" text NOT NULL,
	"key" "option_key" NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "mcq_options_mcq_id_key_pk" PRIMARY KEY("mcq_id","key")
);
--> statement-breakpoint
CREATE TABLE "mcqs" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"position" integer NOT NULL,
	"stem" text NOT NULL,
	"correct" "option_key" NOT NULL,
	"explanation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saq_marking_points" (
	"saq_id" text NOT NULL,
	"position" integer NOT NULL,
	"text" text NOT NULL,
	"marks" integer NOT NULL,
	CONSTRAINT "saq_marking_points_saq_id_position_pk" PRIMARY KEY("saq_id","position")
);
--> statement-breakpoint
CREATE TABLE "saqs" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"position" integer NOT NULL,
	"stem" text NOT NULL,
	"marks" integer NOT NULL,
	"examiner_note" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"chapter_id" text NOT NULL,
	"title" text NOT NULL,
	"position" integer NOT NULL,
	"reading" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mcq_options" ADD CONSTRAINT "mcq_options_mcq_id_mcqs_id_fk" FOREIGN KEY ("mcq_id") REFERENCES "public"."mcqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcqs" ADD CONSTRAINT "mcqs_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saq_marking_points" ADD CONSTRAINT "saq_marking_points_saq_id_saqs_id_fk" FOREIGN KEY ("saq_id") REFERENCES "public"."saqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saqs" ADD CONSTRAINT "saqs_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;