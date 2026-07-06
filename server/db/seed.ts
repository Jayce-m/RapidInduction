import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
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
} from "./schema";
import { Question, questionSchema } from "../data/questionDB";

config({ path: "../.env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Progress tracking
class ProgressTracker {
    private total: number;
    private current: number = 0;
    private startTime: number;

    constructor(total: number) {
        this.total = total;
        this.startTime = Date.now();
    }

    increment() {
        this.current++;
        const elapsed = Date.now() - this.startTime;
        const avgTime = elapsed / this.current;
        const remaining = (this.total - this.current) * avgTime;
        
        console.log(
            `[${this.current}/${this.total}] ` +
            `${Math.round((this.current / this.total) * 100)}% ` +
            `ETA: ${Math.round(remaining / 1000)}s`
        );
    }
}

// Data insertion functions
async function insertUniqueTopics(questionData: Question[]) {
    console.log("📁 Inserting topics...");
    const topicMap = new Map<string, number>();
    const allTopics = new Set<string>();
    
    questionData.forEach(q => q.topic?.forEach(t => t && allTopics.add(t)));
    
    const topicValues = Array.from(allTopics).map(name => ({ name }));
    
    // Batch insert with conflict handling
    for (const batch of chunkArray(topicValues, 100)) {
        await db.insert(topics).values(batch).onConflictDoNothing();
    }
    
    // Fetch all topics to build map
    const insertedTopics = await db.select().from(topics);
    insertedTopics.forEach(t => topicMap.set(t.name, t.id));
    
    console.log(`✅ Inserted ${topicMap.size} topics`);
    return topicMap;
}

async function insertUniqueSubtopics(questionData: Question[]) {
    console.log("📂 Inserting subtopics...");
    const subtopicMap = new Map<string, number>();
    const allSubtopics = new Set<string>();
    
    questionData.forEach(q => q.subtopic?.forEach(s => s && allSubtopics.add(s)));
    
    const subtopicValues = Array.from(allSubtopics).map(name => ({ name }));
    
    for (const batch of chunkArray(subtopicValues, 100)) {
        await db.insert(subtopics).values(batch).onConflictDoNothing();
    }
    
    const insertedSubtopics = await db.select().from(subtopics);
    insertedSubtopics.forEach(s => subtopicMap.set(s.name, s.id));
    
    console.log(`✅ Inserted ${subtopicMap.size} subtopics`);
    return subtopicMap;
}

async function insertUniqueInstructionWords(questionData: Question[]) {
    console.log("📝 Inserting instruction words...");
    const instructionWordMap = new Map<string, number>();
    const allInstructionWords = new Set<string>();
    
    questionData.forEach(q => q.instructionWord?.forEach(i => i && allInstructionWords.add(i)));
    
    const wordValues = Array.from(allInstructionWords).map(word => ({ word }));
    
    for (const batch of chunkArray(wordValues, 100)) {
        await db.insert(instructionWords).values(batch).onConflictDoNothing();
    }
    
    const insertedWords = await db.select().from(instructionWords);
    insertedWords.forEach(w => instructionWordMap.set(w.word, w.id));
    
    console.log(`✅ Inserted ${instructionWordMap.size} instruction words`);
    return instructionWordMap;
}

async function insertUniqueCoreConcepts(questionData: Question[]) {
    console.log("💡 Inserting core concepts...");
    const coreConceptMap = new Map<string, number>();
    const allCoreConcepts = new Set<string>();
    
    questionData.forEach(q => q.coreConcepts?.forEach(c => c && allCoreConcepts.add(c)));
    
    const conceptValues = Array.from(allCoreConcepts).map(concept => ({ concept }));
    
    for (const batch of chunkArray(conceptValues, 100)) {
        await db.insert(coreConcepts).values(batch).onConflictDoNothing();
    }
    
    const insertedConcepts = await db.select().from(coreConcepts);
    insertedConcepts.forEach(c => coreConceptMap.set(c.concept, c.id));
    
    console.log(`✅ Inserted ${coreConceptMap.size} core concepts`);
    return coreConceptMap;
}

async function insertQuestion(
    q: Question,
    topicMap: Map<string, number>,
    subtopicMap: Map<string, number>,
    instructionWordMap: Map<string, number>,
    coreConceptMap: Map<string, number>
) {
    try {
        // Validate question data
        const validatedQuestion = questionSchema.parse(q);
        
        // Insert the question
        const [newQuestion] = await db
            .insert(questions)
            .values({
                order: validatedQuestion.order,
                examYear: validatedQuestion.examYear,
                sitting: validatedQuestion.sitting,
                questionType: validatedQuestion.questionType,
                passRate: validatedQuestion.passRate?.toString(),
                aiGenerated: validatedQuestion.aiGenerated || false,
            })
            .returning();

        // Batch insert question parts
        const questionPartsData = validatedQuestion.parts.map((part, i) => ({
            questionId: newQuestion.id,
            prompt: part.prompt,
            answer: part.answer || "",
            weight: part.weight?.toString(),
            orderIndex: i + 1,
        }));
        
        const insertedParts = await db
            .insert(questionParts)
            .values(questionPartsData)
            .returning();

        // Handle images for parts
        for (let i = 0; i < validatedQuestion.parts.length; i++) {
            const part = validatedQuestion.parts[i];
            if (part.images && part.images.length > 0) {
                const imageData = part.images.map(img => ({
                    filename: img.id,
                    storagePath: img.url,
                    cdnUrl: img.url,
                    mimeType: 'image/png',
                    sizeBytes: 0,
                }));
                
                const insertedImages = await db
                    .insert(images)
                    .values(imageData)
                    .returning();
                
                const imageLinks = insertedImages.map((img, idx) => ({
                    questionPartId: insertedParts[i].id,
                    imageId: img.id,
                    displayOrder: idx + 1,
                }));
                
                await db.insert(questionPartImages).values(imageLinks);
            }
        }

        // Batch insert relationships
        const topicLinks = validatedQuestion.topic
            ?.map(t => topicMap.get(t))
            .filter(Boolean)
            .map(topicId => ({
                questionId: newQuestion.id,
                topicId: topicId!,
            })) || [];
        
        if (topicLinks.length > 0) {
            await db.insert(questionTopics).values(topicLinks).onConflictDoNothing();
        }

        const subtopicLinks = validatedQuestion.subtopic
            ?.map(s => subtopicMap.get(s))
            .filter(Boolean)
            .map(subtopicId => ({
                questionId: newQuestion.id,
                subtopicId: subtopicId!,
            })) || [];
        
        if (subtopicLinks.length > 0) {
            await db.insert(questionSubtopics).values(subtopicLinks).onConflictDoNothing();
        }

        const instructionWordLinks = validatedQuestion.instructionWord
            ?.map(w => instructionWordMap.get(w))
            .filter(Boolean)
            .map(instructionWordId => ({
                questionId: newQuestion.id,
                instructionWordId: instructionWordId!,
            })) || [];
        
        if (instructionWordLinks.length > 0) {
            await db.insert(questionInstructionWords).values(instructionWordLinks).onConflictDoNothing();
        }

        const coreConceptLinks = validatedQuestion.coreConcepts
            ?.map(c => coreConceptMap.get(c))
            .filter(Boolean)
            .map(coreConceptId => ({
                questionId: newQuestion.id,
                coreConceptId: coreConceptId!,
            })) || [];
        
        if (coreConceptLinks.length > 0) {
            await db.insert(questionCoreConcepts).values(coreConceptLinks).onConflictDoNothing();
        }

        // Insert examiner's notes
        if (validatedQuestion.examinersNotes && validatedQuestion.examinersNotes.length > 0) {
            const notesData = validatedQuestion.examinersNotes.map((note, i) => ({
                questionId: newQuestion.id,
                note: note,
                orderIndex: i + 1,
            }));
            
            await db.insert(examinersNotes).values(notesData);
        }

        return newQuestion.id;
    } catch (error) {
        console.error(`❌ Failed to insert question ${q.id}:`, error);
        throw error;
    }
}

// Utility functions
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

async function loadQuestionData(): Promise<Question[]> {
    try {
        // Dynamic import to handle potential module issues
        const module = await import("../data/questionDB");
        return module.questionDB || module.default || [];
    } catch (error) {
        console.error("Failed to load question data:", error);
        return [];
    }
}

// Main migration function
async function migrateQuestions() {
    console.log("🚀 Starting migration...");
    
    const questionDB = await loadQuestionData();
    
    if (questionDB.length === 0) {
        console.error("❌ No question data found!");
        return;
    }
    
    console.log(`📊 Found ${questionDB.length} questions to migrate`);
    
    const progress = new ProgressTracker(questionDB.length);
    
    try {
        // Insert all lookup data first (sequentially to avoid overwhelming the Neon HTTP connection)
        const topicMap = await insertUniqueTopics(questionDB);
        const subtopicMap = await insertUniqueSubtopics(questionDB);
        const instructionWordMap = await insertUniqueInstructionWords(questionDB);
        const coreConceptMap = await insertUniqueCoreConcepts(questionDB);

        // Process questions in batches
        console.log("❓ Inserting questions...");
        let successCount = 0;
        const errors: Array<{ questionId: number; error: any }> = [];
        
        // Process questions one by one to maintain transaction integrity
        for (const q of questionDB) {
            try {
                await insertQuestion(q, topicMap, subtopicMap, instructionWordMap, coreConceptMap);
                successCount++;
                progress.increment();
            } catch (error) {
                errors.push({ questionId: q.id, error });
            }
        }

        console.log(`\n✅ Migration complete! Successfully inserted ${successCount}/${questionDB.length} questions.`);
        
        if (errors.length > 0) {
            console.log(`\n⚠️  ${errors.length} questions failed to insert:`);
            errors.forEach(({ questionId, error }) => {
                console.log(`  - Question ${questionId}: ${error.message}`);
            });
        }

        // Verify the migration
        const totalQuestions = await db.$count(questions);
        console.log(`\n📊 Total questions in database: ${totalQuestions}`);

    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    }
}

// Run the migration
if (import.meta.main) {
    migrateQuestions()
        .then(() => {
            console.log("🎉 All done!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Fatal error:", error);
            process.exit(1);
        });
}

export { migrateQuestions };