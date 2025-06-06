export interface Image {
    id: string;
    url: string;
}

export interface QuestionPart {
    prompt: string;
    answer: string;
    weight?: number;
    images?: Image[];
}

export interface Question {
    id: number;
    order: number;
    topic: string;
    subtopic?: string;
    examYear: number;
    sitting: number;
    questionType: "MCQ" | "SAQ" | "Viva";
    instructionWord?: "Discuss" | "Describe" | "Define" | "Explain" | "Outline" | "Compare" | "Contrast" | "Evaluate" | "Illustrate" | "Interpret" | "Justify" | "List" | "Relate";
    passRate?: number;
    coreTopic?: boolean;
    aiGenerated?: boolean;
    keyConcepts?: string[];
    images?: Image[];
    parts: QuestionPart[];
} 