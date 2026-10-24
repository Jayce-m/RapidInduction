CREATE TYPE "public"."examiner_style" AS ENUM('supportive', 'standard', 'probing');--> statement-breakpoint
CREATE TYPE "public"."response_mode" AS ENUM('voice', 'text');--> statement-breakpoint
CREATE TYPE "public"."viva_status" AS ENUM('live', 'marking', 'marked', 'failed');--> statement-breakpoint
CREATE TABLE "viva_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"station_id" text NOT NULL,
	"style" "examiner_style" NOT NULL,
	"mode" "response_mode" NOT NULL,
	"minutes" integer NOT NULL,
	"status" "viva_status" DEFAULT 'live' NOT NULL,
	"conversation_id" text,
	"transcript" jsonb,
	"marking" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	CONSTRAINT "viva_sessions_conversation_id_unique" UNIQUE("conversation_id")
);
--> statement-breakpoint
CREATE TABLE "viva_stations" (
	"id" text PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"title" text NOT NULL,
	"domain" text NOT NULL,
	"blurb" text NOT NULL,
	"examiner_name" text NOT NULL,
	"scenario" text NOT NULL,
	"question_plan" jsonb NOT NULL,
	"exhibits" jsonb NOT NULL,
	"key_points" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "viva_sessions" ADD CONSTRAINT "viva_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viva_sessions" ADD CONSTRAINT "viva_sessions_station_id_viva_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."viva_stations"("id") ON DELETE no action ON UPDATE no action;