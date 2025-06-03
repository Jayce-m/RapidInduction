import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ============================================
// BETTER APPROACH: Helper Function
// ============================================

async function generatePDFImproved(questions: any[]) {
    const pdfDoc = await PDFDocument.create();
    let currentPage = pdfDoc.addPage();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 12;
    const margin = 50;
    let yPosition = currentPage.getHeight() - margin;
    const lineHeight = fontSize * 1.5; // Normal line height

    // ✅ Helper function to handle page breaks
    function checkPageBreak(spaceNeeded: number = lineHeight) {
        if (yPosition < margin + spaceNeeded) {
            currentPage = pdfDoc.addPage();
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

    // Use the helpers
    addText('Generated Exam Questions', {
        size: 16,
        font: boldFont,
        lineHeight: lineHeight * 2,
    });

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

    // Save and download
    const pdfBytes = await pdfDoc.save();
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