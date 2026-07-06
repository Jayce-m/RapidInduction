CREATE TABLE "core_concepts" (
	"id" serial PRIMARY KEY NOT NULL,
	"concept" text NOT NULL,
	CONSTRAINT "core_concepts_concept_unique" UNIQUE("concept")
);
--> statement-breakpoint
CREATE TABLE "examiners_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"note" text NOT NULL,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"storage_path" text NOT NULL,
	"cdn_url" text NOT NULL,
	"mime_type" varchar(100) DEFAULT 'image/png' NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instruction_words" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	CONSTRAINT "instruction_words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
CREATE TABLE "question_core_concepts" (
	"question_id" integer NOT NULL,
	"core_concept_id" integer NOT NULL,
	CONSTRAINT "question_core_concepts_question_id_core_concept_id_pk" PRIMARY KEY("question_id","core_concept_id")
);
--> statement-breakpoint
CREATE TABLE "question_instruction_words" (
	"question_id" integer NOT NULL,
	"instruction_word_id" integer NOT NULL,
	CONSTRAINT "question_instruction_words_question_id_instruction_word_id_pk" PRIMARY KEY("question_id","instruction_word_id")
);
--> statement-breakpoint
CREATE TABLE "question_part_images" (
	"question_part_id" integer NOT NULL,
	"image_id" integer NOT NULL,
	"display_order" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "question_part_images_question_part_id_image_id_pk" PRIMARY KEY("question_part_id","image_id")
);
--> statement-breakpoint
CREATE TABLE "question_parts" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"prompt" text NOT NULL,
	"answer" text DEFAULT '' NOT NULL,
	"weight" numeric(5, 2),
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_subtopics" (
	"question_id" integer NOT NULL,
	"subtopic_id" integer NOT NULL,
	CONSTRAINT "question_subtopics_question_id_subtopic_id_pk" PRIMARY KEY("question_id","subtopic_id")
);
--> statement-breakpoint
CREATE TABLE "question_topics" (
	"question_id" integer NOT NULL,
	"topic_id" integer NOT NULL,
	CONSTRAINT "question_topics_question_id_topic_id_pk" PRIMARY KEY("question_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "subtopics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "subtopics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "topics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "examiners_notes" ADD CONSTRAINT "examiners_notes_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_core_concepts" ADD CONSTRAINT "question_core_concepts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_core_concepts" ADD CONSTRAINT "question_core_concepts_core_concept_id_core_concepts_id_fk" FOREIGN KEY ("core_concept_id") REFERENCES "public"."core_concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_instruction_words" ADD CONSTRAINT "question_instruction_words_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_instruction_words" ADD CONSTRAINT "question_instruction_words_instruction_word_id_instruction_words_id_fk" FOREIGN KEY ("instruction_word_id") REFERENCES "public"."instruction_words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_part_images" ADD CONSTRAINT "question_part_images_question_part_id_question_parts_id_fk" FOREIGN KEY ("question_part_id") REFERENCES "public"."question_parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_part_images" ADD CONSTRAINT "question_part_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_parts" ADD CONSTRAINT "question_parts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_subtopics" ADD CONSTRAINT "question_subtopics_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_subtopics" ADD CONSTRAINT "question_subtopics_subtopic_id_subtopics_id_fk" FOREIGN KEY ("subtopic_id") REFERENCES "public"."subtopics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_topics" ADD CONSTRAINT "question_topics_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_topics" ADD CONSTRAINT "question_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;