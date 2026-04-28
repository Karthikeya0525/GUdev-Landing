import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

function sanitizeText(str: string) {
  return str
    .replace(/\u2011/g, '-') // non-breaking hyphen
    .replace(/[\u2013\u2014]/g, '-') // en/em dash
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/\u2026/g, '...') // ellipsis
    .replace(/[^\x20-\x7E\n\r\t]/g, ''); // strip any remaining non-ASCII to prevent crashes
}

// Helper function to wrap text
function wrapText(text: any, font: any, fontSize: number, maxWidth: number) {
  const safeText = sanitizeText(String(text || ""));
  const paragraphs = safeText.split('\n');
  let lines: string[] = [];
  
  paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let currentLine = words[0] || "";
      
      for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = font.widthOfTextAtSize(currentLine + " " + word, fontSize);
          if (width < maxWidth) {
              currentLine += " " + word;
          } else {
              lines.push(currentLine);
              currentLine = word;
          }
      }
      lines.push(currentLine);
  });
  return lines;
}

export async function generatePDF(prdData: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;
    const margin = 50;
    const contentWidth = width - (margin * 2);

    const addText = (text: any, size: number, isBold: boolean = false, color = rgb(0, 0, 0)) => {
      const currentFont = isBold ? boldFont : font;
      const lines = wrapText(text, currentFont, size, contentWidth);
      
      lines.forEach(line => {
        if (y < 50) {
          const newPage = pdfDoc.addPage();
          y = newPage.getSize().height - 50;
        }
        const currentPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
        currentPage.drawText(line, {
          x: margin,
          y: y,
          size: size,
          font: currentFont,
          color: color,
        });
        y -= (size + 5);
      });
      y -= 10;
    };

    const getList = (val: any) => Array.isArray(val) ? val.join('\n- ') : String(val || "");

    // Title
    addText(prdData.project_name || "Project PRD", 24, true, rgb(0, 0.4, 0.8));
    addText(prdData.tagline || "", 14, false, rgb(0.4, 0.4, 0.4));
    y -= 20;

    const sections = [
      { title: "Problem Statement", content: prdData.problem_statement },
      { title: "Solution", content: prdData.solution },
      { title: "Target Audience", content: Array.isArray(prdData.target_audience) ? prdData.target_audience.join(', ') : prdData.target_audience },
      { title: "Market Opportunity", content: prdData.market_opportunity },
      { title: "Core Features", content: getList(prdData.core_features) },
      { title: "User Flow", content: Array.isArray(prdData.user_flow) ? prdData.user_flow.join(' -> ') : prdData.user_flow },
      { title: "Monetization Model", content: prdData.monetization_model },
      { title: "Tech Stack", content: Array.isArray(prdData.tech_stack_suggestion) ? prdData.tech_stack_suggestion.join(', ') : prdData.tech_stack_suggestion },
      { title: "Timeline", content: prdData.timeline_estimate },
      { title: "Risks", content: getList(prdData.risks) },
      { title: "Future Scope", content: prdData.future_scope },
    ];

    sections.forEach(section => {
      if (section.content) {
        addText(section.title.toUpperCase(), 12, true, rgb(0.2, 0.2, 0.2));
        addText(section.content, 10);
      }
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString('base64');
}
