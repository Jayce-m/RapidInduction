CREATE TYPE "public"."question_type" AS ENUM('MCQ', 'SAQ', 'Viva');--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"exam_year" integer NOT NULL,
	"sitting" integer DEFAULT 1 NOT NULL,
	"question_type" "question_type" NOT NULL,
	"pass_rate" numeric(5, 2),
	"ai_generated" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "exam_year_check" CHECK ("questions"."exam_year" >= 2000 AND "questions"."exam_year" <= EXTRACT(YEAR FROM CURRENT_DATE)),
	CONSTRAINT "sitting_check" CHECK ("questions"."sitting" IN (1, 2)),
	CONSTRAINT "pass_rate_check" CHECK ("questions"."pass_rate" >= 0 AND "questions"."pass_rate" <= 100)
);
