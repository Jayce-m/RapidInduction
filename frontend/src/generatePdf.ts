import { PDFDocument, type PDFFont, type PDFImage, type RGB, StandardFonts, rgb } from "pdf-lib";

// types/api.ts
export interface ApiQuestion {
    id: number;
    question: string;
    answer: string;
    topic: string;
    examYear: number;
    sitting: number;
    images?: Array<{
        id: string;
        url: string;
    }>;
}

// Helper function to create cover page
async function createCoverPage(pdf: PDFDocument, title: string, subtitle: string, questionCount: number) {
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    const coverPage = pdf.addPage();

    const coverPageTitle = "AUSTRALIAN AND NEW ZEALAND COLLEGE OF ANAESTHETISTS";
    const coverPageTitleFontSize = 12;

    const textWidth = font.widthOfTextAtSize(coverPageTitle, coverPageTitleFontSize);
    const textCenterX = (coverPage.getWidth() - textWidth) / 2;

    coverPage.drawText(coverPageTitle, {
        x: textCenterX,
        y: coverPage.getHeight() - 80,
        size: coverPageTitleFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    // Cover page image
    try {
        const coverImageUrl = "/cover_page_logo.png";
        const coverImageBytes = await fetch(coverImageUrl).then(res => res.arrayBuffer());
        const coverImage = await pdf.embedPng(coverImageBytes);

        const imageWidth = 200;
        const imageHeight = 300;
        const pageWidth = coverPage.getWidth();
        const pageHeight = coverPage.getHeight();
        const centerX = (pageWidth - imageWidth) / 2;
        const centerY = (pageHeight - imageHeight) / 2 + 190;

        coverPage.drawImage(coverImage, {
            x: centerX,
            y: centerY,
            width: imageWidth,
            height: imageHeight
        });
    } catch (error) {
        console.warn("Could not load cover image:", error);
    }

    // Sub titles
    const subTitleLine1 = title;
    const subTitleLine1Width = font.widthOfTextAtSize(subTitleLine1, 15);
    const subTitleLine1CenterX = (coverPage.getWidth() - subTitleLine1Width) / 2;
    const subTitleLine1Y = 400;

    const subTitleLine2 = "12 AUGUST 2023 (2023.2)";
    const subTitleLine2Width = font.widthOfTextAtSize(subTitleLine2, 12);
    const subTitleLine2CenterX = (coverPage.getWidth() - subTitleLine2Width) / 2;

    const subTitleLine3 = subtitle;
    const subTitleLine3Width = font.widthOfTextAtSize(subTitleLine3, 11);
    const subTitleLine3CenterX = (coverPage.getWidth() - subTitleLine3Width) / 2;

    const subTitleLine4 = `${questionCount} QUESTIONS`;
    const subTitleLine4Width = font.widthOfTextAtSize(subTitleLine4, 11);
    const subTitleLine4CenterX = (coverPage.getWidth() - subTitleLine4Width) / 2;

    coverPage.drawText(subTitleLine1, {
        x: subTitleLine1CenterX,
        y: coverPage.getHeight() - subTitleLine1Y,
        size: 15,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    coverPage.drawText(subTitleLine2, {
        x: subTitleLine2CenterX,
        y: coverPage.getHeight() - subTitleLine1Y - 20,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    coverPage.drawText(subTitleLine3, {
        x: subTitleLine3CenterX,
        y: coverPage.getHeight() - subTitleLine1Y - 50,
        size: 11,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    coverPage.drawText(subTitleLine4, {
        x: subTitleLine4CenterX,
        y: coverPage.getHeight() - subTitleLine1Y - 70,
        size: 11,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    return { font, boldFont };
}

interface TextOptions {
    x?: number;           // X position
    y?: number;           // Y position  
    size?: number;        // Font size
    font?: PDFFont;       // Font object
    color?: RGB;          // Color object from rgb()
    lineHeight?: number;  // Custom line height
}

// Helper function to add instructions page (only for question booklet)
async function addInstructionsPage(pdf: PDFDocument, font: PDFFont, boldFont: PDFFont) {
    const coverPage = pdf.getPages()[0]; // Get the cover page to add instructions
    const margin = 50;
    const lineHeight = 18;

    let yPos = coverPage.getHeight() - margin;
    function drawText(text: string, options: Partial<TextOptions>) {
        const opts = {
            x: margin,
            y: yPos,
            size: 12,
            font: boldFont,
            color: rgb(0, 0, 0),
            ...options,
        };

        coverPage.drawText(text, opts);
        yPos -= options.lineHeight || lineHeight;
        return opts;
    }

    function drawUnderlinedText(text: string, options: Partial<TextOptions>) {
        const opts = drawText(text, options);
        const textWidth = opts.font.widthOfTextAtSize(text, opts.size);
        const underlineY = opts.y - 2;

        coverPage.drawLine({
            start: { x: opts.x, y: underlineY },
            end: { x: opts.x + textWidth, y: underlineY },
            thickness: 1,
            color: opts.color,
        });

        return opts;
    }

    const instructionsHeading = "INSTRUCTIONS";
    const instructionsHeadingWidth = font.widthOfTextAtSize(instructionsHeading, 11);
    const instructionsHeadingCenterX = (coverPage.getWidth() - instructionsHeadingWidth) / 2 - 200;
    const instructionsHeadingY = 540;

    drawUnderlinedText(instructionsHeading, {
        x: instructionsHeadingCenterX,
        y: coverPage.getHeight() - instructionsHeadingY,
        size: 11,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    const instructionsTextLines = [
        '• Record your candidate number on the cover of EACH of the fifteen (15) answer books.',
        "• There are 15 questions to answer. Each worth equal marks.",
        "• Write the answer to each question in a separate answer book.",
        "• Writing during reading time is permitted on the question paper only.",
        "• No queries regarding individual questions can be answered.",
        "• All answer books MUST be toggled together and handed in at the conclusion of the examination.",
        "• The question paper may be taken with you."
    ];

    for (const line of instructionsTextLines) {
        drawText(line, { font: font, y: yPos - 500, size: 11, lineHeight: 14 });
        yPos -= 12;
    }
}

// Main function to generate question booklet
async function generateQuestionBooklet(questions: ApiQuestion[]) {
    const questionBookletPdf = await PDFDocument.create();
    const fontSize = 12;
    const margin = 50;
    const lineHeight = fontSize * 1.5;

    // Create cover page
    const { font, boldFont } = await createCoverPage(
        questionBookletPdf,
        "ANZCA FINAL EXAMINATION",
        "SHORT ANSWER QUESTION PAPER",
        questions.length
    );

    // Add instructions
    await addInstructionsPage(questionBookletPdf, font, boldFont);

    // Question pages
    let currentPage = questionBookletPdf.addPage();
    let yPosition = currentPage.getHeight() - margin;

    // Helper functions (same as before)
    function checkPageBreak(spaceNeeded: number = lineHeight) {
        if (yPosition < margin + spaceNeeded) {
            currentPage = questionBookletPdf.addPage();
            yPosition = currentPage.getHeight() - margin;
            return true;
        }
        return false;
    }

    function addText(text: string, options: Partial<TextOptions>) {
        checkPageBreak(options.size || fontSize);
        currentPage.drawText(text, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
            ...options,
        });
        yPosition -= options.lineHeight || lineHeight;
    }

    async function fetchAndEmbedImage(url: string) {
        try {
            console.log(`Attempting to fetch image: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const imageBytes = new Uint8Array(arrayBuffer);
            const contentType = response.headers.get('content-type');
            let embeddedImage: PDFImage;

            if (contentType?.includes('image/png') || url.toLowerCase().includes('.png')) {
                embeddedImage = await questionBookletPdf.embedPng(imageBytes);
            } else if (contentType?.includes('image/jpeg') || contentType?.includes('image/jpg') ||
                url.toLowerCase().includes('.jpg') || url.toLowerCase().includes('.jpeg')) {
                embeddedImage = await questionBookletPdf.embedJpg(imageBytes);
            } else {
                try {
                    embeddedImage = await questionBookletPdf.embedJpg(imageBytes);
                } catch {
                    embeddedImage = await questionBookletPdf.embedPng(imageBytes);
                }
            }

            return embeddedImage;
        } catch (error) {
            console.error(`Error embedding image from ${url}:`, error);
            return null;
        }
    }

    async function addImage(imageUrl: string, options: { maxWidth?: number; maxHeight?: number } = {}) {
        const embeddedImage = await fetchAndEmbedImage(imageUrl);
        if (!embeddedImage) return;

        const pageWidth = currentPage.getWidth() - margin * 2;
        const maxWidth = options.maxWidth || pageWidth;
        const maxHeight = options.maxHeight || 200;

        const { width: originalWidth, height: originalHeight } = embeddedImage.scale(1);
        let scaledWidth = originalWidth;
        let scaledHeight = originalHeight;

        if (scaledWidth > maxWidth) {
            const widthRatio = maxWidth / scaledWidth;
            scaledWidth = maxWidth;
            scaledHeight = scaledHeight * widthRatio;
        }

        if (scaledHeight > maxHeight) {
            const heightRatio = maxHeight / scaledHeight;
            scaledHeight = maxHeight;
            scaledWidth = scaledWidth * heightRatio;
        }

        checkPageBreak(scaledHeight);
        currentPage.drawImage(embeddedImage, {
            x: margin,
            y: yPosition - scaledHeight,
            width: scaledWidth,
            height: scaledHeight,
        });
        yPosition -= scaledHeight + lineHeight;
    }

    async function addQuestionImages(images: Array<{ id: string, url: string }>) {
        if (!images || images.length === 0) return;
        yPosition -= lineHeight / 2;
        for (const image of images) {
            await addImage(image.url, { maxHeight: 250 });
            if (images.length > 1) {
                yPosition -= lineHeight / 2;
            }
        }
    }

    function calculateQuestionSpace(question: ApiQuestion): number {
        const words = question.question.split(' ');
        let line = '';
        let lineCount = 0;
        const maxWidth = currentPage.getWidth() - margin * 2;

        for (const word of words) {
            const testLine = `${line + word} `;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (testWidth > maxWidth && line) {
                lineCount++;
                line = `${word} `;
            } else {
                line = testLine;
            }
        }
        if (line) lineCount++;

        let spaceNeeded = lineHeight + (lineCount * lineHeight) + lineHeight + 50;
        if (question.images && question.images.length > 0) {
            spaceNeeded += (250 + lineHeight) * question.images.length;
        }
        return spaceNeeded;
    }

    function addWrappedText(text: string, options: Partial<TextOptions>) {
        const words = text.split(' ');
        let line = '';
        const maxWidth = currentPage.getWidth() - margin * 2;
        const textFont = options.font || font;
        const textSize = options.size || fontSize;

        for (const word of words) {
            const testLine = `${line + word} `;
            const testWidth = textFont.widthOfTextAtSize(testLine, textSize);
            if (testWidth > maxWidth && line) {
                addText(line.trim(), options);
                line = `${word} `;
            } else {
                line = testLine;
            }
        }
        if (line) {
            addText(line.trim(), options);
        }
    }

    // Process questions
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const spaceNeeded = calculateQuestionSpace(question);

        if (yPosition < margin + spaceNeeded) {
            currentPage = questionBookletPdf.addPage();
            yPosition = currentPage.getHeight() - margin;
        }

        addText(`Question ${i + 1}:`, { font: boldFont });
        addWrappedText(question.question, {});

        if (question.images && question.images.length > 0) {
            await addQuestionImages(question.images);
        }

        yPosition -= lineHeight + 50;
    }

    return questionBookletPdf;
}

// Function to generate answer booklet
async function generateAnswerBooklet(questions: ApiQuestion[]) {
    const answerBookletPdf = await PDFDocument.create();
    const fontSize = 12;
    const margin = 50;
    const lineHeight = fontSize * 1.5;

    // Create cover page
    const { font, boldFont } = await createCoverPage(
        answerBookletPdf,
        "ANZCA FINAL EXAMINATION",
        "ANSWER GUIDE",
        questions.length
    );

    // Answer pages
    let currentPage = answerBookletPdf.addPage();
    let yPosition = currentPage.getHeight() - margin;

    function checkPageBreak(spaceNeeded: number = lineHeight) {
        if (yPosition < margin + spaceNeeded) {
            currentPage = answerBookletPdf.addPage();
            yPosition = currentPage.getHeight() - margin;
            return true;
        }
        return false;
    }

    function addText(text: string, options: Partial<TextOptions>) {
        checkPageBreak(options.size || fontSize);
        currentPage.drawText(text, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
            ...options,
        });
        yPosition -= options.lineHeight || lineHeight;
    }

    function addWrappedText(text: string, options: Partial<TextOptions>) {
        const words = text.split(' ');
        let line = '';
        const maxWidth = currentPage.getWidth() - margin * 2;
        const textFont = options.font || font;
        const textSize = options.size || fontSize;

        for (const word of words) {
            const testLine = `${line + word} `;
            const testWidth = textFont.widthOfTextAtSize(testLine, textSize);
            if (testWidth > maxWidth && line) {
                addText(line.trim(), options);
                line = `${word} `;
            } else {
                line = testLine;
            }
        }
        if (line) {
            addText(line.trim(), options);
        }
    }

    // Process answers
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        // Check if we need a new page for this question
        checkPageBreak(lineHeight * 8); // Rough estimate for question + answer

        addText(`Question ${i + 1}:`, { font: boldFont });
        addWrappedText(question.question, { color: rgb(0.3, 0.3, 0.3) }); // Lighter color for question

        yPosition -= lineHeight / 2; // Small gap

        addText("Answer:", { font: boldFont, color: rgb(0, 0.5, 0) }); // Green for answer label
        addWrappedText(question.answer, { color: rgb(0, 0.3, 0) }); // Dark green for answer

        yPosition -= lineHeight * 2; // Larger gap between questions
    }

    return answerBookletPdf;
}

// Main function that generates both PDFs
async function generatePDF(questions: ApiQuestion[]) {
    try {
        const questionBooklet = await generateQuestionBooklet(questions);
        const answerBooklet = await generateAnswerBooklet(questions);

        console.log("Downloading question booklet...");
        const questionPdfBytes = await questionBooklet.save();
        downloadPDF(questionPdfBytes, 'exam-questions.pdf');

        console.log("Downloading answer booklet...");
        const answerPdfBytes = await answerBooklet.save();
        downloadPDF(answerPdfBytes, 'exam-answers.pdf');

        // Small delay to prevent browser blocking multiple downloads
        // setTimeout(async () => {
        // console.log("Downloading answer booklet...");
        // const answerPdfBytes = await answerBooklet.save();
        // downloadPDF(answerPdfBytes, 'exam-answers.pdf');
        // }, 500);

    } catch (error) {
        console.error("Error generating PDFs:", error);
        throw error;
    }
}

// Helper function to download PDF
function downloadPDF(pdfBytes: Uint8Array, filename: string) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export { generatePDF };