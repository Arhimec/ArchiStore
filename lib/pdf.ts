import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export interface SamplePdfData {
  title: string;
  style: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  dimensions: string;
}

/**
 * Generates a 1-page watermarked sample floor plan PDF dynamically using pdf-lib.
 */
export async function generateSamplePdf(data: SamplePdfData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([792, 612]); // Landscape Letter (11in x 8.5in)

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background header band
  page.drawRectangle({
    x: 0,
    y: 532,
    width: 792,
    height: 80,
    color: rgb(0.04, 0.07, 0.16), // Dark Navy
  });

  // Header Title
  page.drawText('ARCHISTORE ARCHITECTURAL STOCK PLANS', {
    x: 40,
    y: 575,
    size: 14,
    font: helveticaBold,
    color: rgb(0.96, 0.62, 0.04), // Amber/Bronze
  });

  page.drawText(`SAMPLE WATERMARKED PLAN: ${data.title.toUpperCase()}`, {
    x: 40,
    y: 550,
    size: 18,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Main floor plan box outline (simulated schematic floor plan grid)
  page.drawRectangle({
    x: 40,
    y: 120,
    width: 712,
    height: 380,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 2,
    color: rgb(0.98, 0.98, 0.98),
  });

  // Inner architectural schematic lines
  page.drawLine({
    start: { x: 40, y: 310 },
    end: { x: 752, y: 310 },
    thickness: 1.5,
    color: rgb(0.3, 0.3, 0.3),
  });
  page.drawLine({
    start: { x: 396, y: 120 },
    end: { x: 396, y: 500 },
    thickness: 1.5,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Room labels inside floor plan preview
  page.drawText('GREAT ROOM & KITCHEN', {
    x: 80,
    y: 420,
    size: 16,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText('PRIMARY SUITE & BATH', {
    x: 440,
    y: 420,
    size: 16,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText('BEDROOM 2 & 3', {
    x: 80,
    y: 210,
    size: 14,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText('COVERED PORCH & GARAGE', {
    x: 440,
    y: 210,
    size: 14,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Large diagonal watermark
  page.drawText('ARCHISTORE SAMPLE - NOT FOR CONSTRUCTION', {
    x: 90,
    y: 180,
    size: 26,
    font: helveticaBold,
    color: rgb(0.85, 0.2, 0.2),
    rotate: degrees(30),
    opacity: 0.35,
  });

  // Spec table at bottom
  page.drawRectangle({
    x: 40,
    y: 40,
    width: 712,
    height: 60,
    color: rgb(0.92, 0.94, 0.97),
  });

  const specText = `SPECS: ${data.sqm} SQ M | ${data.bedrooms} BEDS | ${data.bathrooms} BATHS | DIMENSIONS: ${data.dimensions} | STYLE: ${data.style}`;
  page.drawText(specText, {
    x: 60,
    y: 75,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.15, 0.3),
  });

  page.drawText(
    'LEGAL NOTICE: Conceptual sample plan only. Complete construction set requires engineer stamp & local building permit.',
    {
      x: 60,
      y: 52,
      size: 9,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    }
  );

  return await pdfDoc.save();
}
