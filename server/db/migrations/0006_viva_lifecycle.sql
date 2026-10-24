ALTER TYPE "public"."viva_status" ADD VALUE 'unanswered';--> statement-breakpoint
ALTER TABLE "viva_sessions" ADD COLUMN "marking_started_at" timestamp;