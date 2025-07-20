import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
// migrate-questions.ts
import { drizzle } from "drizzle-orm/neon-http";
import {
    coreConcepts,
    examinersNotes,
    images,
    instructionWords,
    questionCoreConcepts,
    questionInstructionWords,
    questionPartImages,
    questionParts,
    questionSubtopics,
    questionTopics,
    questions,
    subtopics,
    topics
} from "./src/db/schema";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Your existing question data (paste the full array here)
const questionDB = [/* your data */];

async function migrateQuestions() {
    console.log("🚀 Starting migration...");

    try {
        // Store mappings for lookups
        const topicMap = new Map<string, number>();
        const subtopicMap = new Map<string, number>();
        const instructionWordMap = new Map<string, number>();
        const coreConceptMap = new Map<string, number>();

        // 1. First, insert all unique topics
        console.log("📁 Inserting topics...");
        const allTopics = new Set<string>();
        questionDB.forEach(q => q.topic?.forEach(t => t && allTopics.add(t)));

        for (const topicName of allTopics) {
            const [topic] = await db
                .insert(topics)
                .values({ name: topicName })
                .onConflictDoNothing()
                .returning();

            if (topic) {
                topicMap.set(topicName, topic.id);
            } else {
                // If conflict, fetch existing
                const existing = await db.select().from(topics).where(eq(topics.name, topicName));
                if (existing[0]) topicMap.set(topicName, existing[0].id);
            }
        }

        // 2. Insert all unique subtopics
        console.log("📂 Inserting subtopics...");
        const allSubtopics = new Set<string>();
        questionDB.forEach(q => q.subtopic?.forEach(s => s && allSubtopics.add(s)));

        for (const subtopicName of allSubtopics) {
            const [subtopic] = await db
                .insert(subtopics)
                .values({ name: subtopicName })
                .onConflictDoNothing()
                .returning();

            if (subtopic) {
                subtopicMap.set(subtopicName, subtopic.id);
            } else {
                const existing = await db.select().from(subtopics).where(eq(subtopics.name, subtopicName));
                if (existing[0]) subtopicMap.set(subtopicName, existing[0].id);
            }
        }

        // 3. Insert all unique instruction words
        console.log("📝 Inserting instruction words...");
        const allInstructionWords = new Set<string>();
        questionDB.forEach(q => q.instructionWord?.forEach(i => i && allInstructionWords.add(i)));

        for (const word of allInstructionWords) {
            const [instructionWord] = await db
                .insert(instructionWords)
                .values({ word })
                .onConflictDoNothing()
                .returning();

            if (instructionWord) {
                instructionWordMap.set(word, instructionWord.id);
            } else {
                const existing = await db.select().from(instructionWords).where(eq(instructionWords.word, word));
                if (existing[0]) instructionWordMap.set(word, existing[0].id);
            }
        }

        // 4. Insert all unique core concepts
        console.log("💡 Inserting core concepts...");
        const allCoreConcepts = new Set<string>();
        questionDB.forEach(q => q.coreConcepts?.forEach(c => c && allCoreConcepts.add(c)));

        for (const concept of allCoreConcepts) {
            const [coreConcept] = await db
                .insert(coreConcepts)
                .values({ concept })
                .onConflictDoNothing()
                .returning();

            if (coreConcept) {
                coreConceptMap.set(concept, coreConcept.id);
            } else {
                const existing = await db.select().from(coreConcepts).where(eq(coreConcepts.concept, concept));
                if (existing[0]) coreConceptMap.set(concept, existing[0].id);
            }
        }

        // 5. Now insert questions and their related data
        console.log("❓ Inserting questions...");
        let successCount = 0;

        for (const q of questionDB) {
            try {
                // Insert the question
                const [newQuestion] = await db
                    .insert(questions)
                    .values({
                        order: q.order,
                        examYear: q.examYear,
                        sitting: q.sitting,
                        questionType: q.questionType as "MCQ" | "SAQ" | "Viva",
                        passRate: q.passRate?.toString(),
                        aiGenerated: q.aiGenerated || false,
                    })
                    .returning();

                console.log(`✅ Inserted question ${newQuestion.id} (${q.examYear}.${q.sitting} Q${q.order})`);

                // Insert question parts
                for (let i = 0; i < q.parts.length; i++) {
                    const part = q.parts[i];
                    const [newPart] = await db
                        .insert(questionParts)
                        .values({
                            questionId: newQuestion.id,
                            prompt: part.prompt,
                            answer: part.answer || "",
                            weight: part.weight?.toString(),
                            orderIndex: i + 1,
                        })
                        .returning();

                    // Handle images for this part
                    if (part.images && part.images.length > 0) {
                        for (let imgIndex = 0; imgIndex < part.images.length; imgIndex++) {
                            const img = part.images[imgIndex];

                            // Insert image
                            const [newImage] = await db
                                .insert(images)
                                .values({
                                    filename: img.id,
                                    storagePath: img.url,
                                    cdnUrl: img.url,
                                    mimeType: 'image/png', // Adjust based on actual type
                                    sizeBytes: 0, // You'll need to update this
                                })
                                .returning();

                            // Link to question part
                            await db
                                .insert(questionPartImages)
                                .values({
                                    questionPartId: newPart.id,
                                    imageId: newImage.id,
                                    displayOrder: imgIndex + 1,
                                });
                        }
                    }
                }

                // Link topics
                if (q.topic) {
                    for (const topicName of q.topic) {
                        const topicId = topicMap.get(topicName);
                        if (topicId) {
                            await db
                                .insert(questionTopics)
                                .values({
                                    questionId: newQuestion.id,
                                    topicId,
                                })
                                .onConflictDoNothing();
                        }
                    }
                }

                // Link subtopics
                if (q.subtopic) {
                    for (const subtopicName of q.subtopic) {
                        const subtopicId = subtopicMap.get(subtopicName);
                        if (subtopicId) {
                            await db
                                .insert(questionSubtopics)
                                .values({
                                    questionId: newQuestion.id,
                                    subtopicId,
                                })
                                .onConflictDoNothing();
                        }
                    }
                }

                // Link instruction words
                if (q.instructionWord) {
                    for (const word of q.instructionWord) {
                        const instructionWordId = instructionWordMap.get(word);
                        if (instructionWordId) {
                            await db
                                .insert(questionInstructionWords)
                                .values({
                                    questionId: newQuestion.id,
                                    instructionWordId,
                                })
                                .onConflictDoNothing();
                        }
                    }
                }

                // Link core concepts
                if (q.coreConcepts) {
                    for (const concept of q.coreConcepts) {
                        const coreConceptId = coreConceptMap.get(concept);
                        if (coreConceptId) {
                            await db
                                .insert(questionCoreConcepts)
                                .values({
                                    questionId: newQuestion.id,
                                    coreConceptId,
                                })
                                .onConflictDoNothing();
                        }
                    }
                }

                // Insert examiner's notes
                if (q.examinersNotes) {
                    for (let i = 0; i < q.examinersNotes.length; i++) {
                        await db
                            .insert(examinersNotes)
                            .values({
                                questionId: newQuestion.id,
                                note: q.examinersNotes[i],
                                orderIndex: i + 1,
                            });
                    }
                }

                successCount++;
            } catch (error) {
                console.error(`❌ Failed to insert question ${q.id}:`, error);
            }
        }

        console.log(`\n✅ Migration complete! Successfully inserted ${successCount}/${questionDB.length} questions.`);

        // Verify the migration
        const totalQuestions = await db.$count(questions);
        console.log(`📊 Total questions in database: ${totalQuestions}`);

    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    }
}

// Add missing import
import { eq } from "drizzle-orm";

// Run the migration
migrateQuestions()
    .then(() => {
        console.log("🎉 All done!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Fatal error:", error);
        process.exit(1);
    });