import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ============================================
// BETTER APPROACH: Helper Function
// ============================================

async function generatePDFImproved(questions: any[]) {
    const questionBookletPdf = await PDFDocument.create();
    const fontSize = 12;
    const margin = 50;
    const lineHeight = fontSize * 1.5;

    // SET PDF DEFAULTS =========================================================

    const font = await questionBookletPdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await questionBookletPdf.embedFont(StandardFonts.HelveticaBold);

    // COVER PAGE =========================================================
    // ====================================================================
    const coverPage = questionBookletPdf.addPage();

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

    // Cover page image ======
    // =======================
    const coverImageUrl = "../public/cover_page_logo.png";
    const coverImageBytes = await fetch(coverImageUrl).then(res => res.arrayBuffer());
    const coverImage = await questionBookletPdf.embedPng(coverImageBytes);

    // Get image dimensions
    const imageWidth = 200;
    const imageHeight = 300;

    // Calculate center position
    const pageWidth = coverPage.getWidth();
    const pageHeight = coverPage.getHeight();
    const centerX = (pageWidth - imageWidth) / 2;
    const centerY = (pageHeight - imageHeight) / 2 + 190;

    // Draw centered image
    coverPage.drawImage(coverImage, {
        x: centerX,
        y: centerY,
        width: imageWidth,
        height: imageHeight
    });

    // Sub title and Instructions ========================
    // ===================================================

    coverPage.drawText(coverPageTitle, {
        x: textCenterX,
        y: coverPage.getHeight() - 80,
        size: coverPageTitleFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    const test = `12 AUGUST 2023 (2023.2) 
SHORT ANSWER QUESTION PAPER
        15 QUESTIONS`

    const subTitleLine1 = "ANZCA FINAL EXAMINATION";
    const subTitleLine1Width = font.widthOfTextAtSize(subTitleLine1, 15);
    const subTitleLine1CenterX = (coverPage.getWidth() - subTitleLine1Width) / 2;
    const subTitleLine1Y = 400;

    const subTitleLine2 = "12 AUGUST 2023 (2023.2)";
    const subTitleLine2Width = font.widthOfTextAtSize(subTitleLine2, 12);
    const subTitleLine2CenterX = (coverPage.getWidth() - subTitleLine2Width) / 2;

    const subTitleLine3 = "SHORT ANSWER QUESTION PAPER";
    const subTitleLine3Width = font.widthOfTextAtSize(subTitleLine3, 11);
    const subTitleLine3CenterX = (coverPage.getWidth() - subTitleLine3Width) / 2;

    const subTitleLine4 = "15 QUESTIONS";
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

    // Instructions text ==========
    // ============================

    let yPos = coverPage.getHeight() - margin;
    function drawText(text: string, options: any = {}) {
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

        return opts; // Return for getting text width, etc.
    }

    function drawUnderlinedText(text: string, options: any = {}) {
        const opts = drawText(text, options);

        // Calculate underline position
        const textWidth = opts.font.widthOfTextAtSize(text, opts.size);
        const underlineY = opts.y - 2; // 2 points below baseline

        // Draw underline
        coverPage.drawLine({
            start: { x: opts.x, y: underlineY },
            end: { x: opts.x + textWidth, y: underlineY },
            thickness: 1,
            color: opts.color,
        });

        return opts;
    }

    // instructions heading
    `INSTRUCTIONS
    ● Record your candidate number on the cover of EACH of the fifteen (15) answer
    books (right hand top corner).
    ● There are 15 Questions to answer. Each worth equal marks.
    ● Write the answer to each question in a separate answer book.
    ● Writing during reading time is permitted on the question paper only.
    ● No queries regarding individual questions can be answered.
    ● All answer books MUST be toggled together and handed in at the conclusion of the
    examination.
    ● The question paper may be taken with you.`

    const instructionsHeading = "INSTRUCTIONS";
    const instructionsHeadingWidth = font.widthOfTextAtSize(instructionsHeading, 11);
    const instructionsHeadingCenterX = (coverPage.getWidth() - instructionsHeadingWidth) / 2 - 180;
    const instructionsHeadingY = 520;

    drawUnderlinedText(instructionsHeading, {
        x: instructionsHeadingCenterX,
        y: coverPage.getHeight() - instructionsHeadingY,
        size: 11,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    const instructionsTextLines = [
        '• Record your candidate number on the cover of EACH of the fifteen (15) answer books (right hand top corner).',
        "• There are 15 Questions to answer. Each worth equal marks.",
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






    // QUESTION PAGES =====================================================
    // ====================================================================

    let currentPage = questionBookletPdf.addPage();
    let yPosition = currentPage.getHeight() - margin;

    // Helper function to handle page breaks
    function checkPageBreak(spaceNeeded: number = lineHeight) {
        if (yPosition < margin + spaceNeeded) {
            currentPage = questionBookletPdf.addPage();
            yPosition = currentPage.getHeight() - margin;
            return true; // New page created
        }
        return false; // Same page
    }

    // ✅ Helper function to add text with auto page break
    function addText(text: string, options: any = {}) {
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

    // ✅ Helper function for wrapped text
    function addWrappedText(text: string, options: any = {}) {
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

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        // Ensure space for question header
        checkPageBreak(lineHeight * 2);

        addText(`Question ${i + 1}:`, {
            font: boldFont,
        });

        addWrappedText(question.question);

        yPosition -= lineHeight + 150; // Extra space between questions
    }




    // Save and download =========================================================================
    // ===========================================================================================
    const pdfBytes = await questionBookletPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam-questions.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export { generatePDFImproved as generatePDF };