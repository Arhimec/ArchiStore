import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function createSamplePdf(filename: string, title: string) {
  const privateDir = path.join(process.cwd(), 'private_storage');
  if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
  }

  const filePath = path.join(privateDir, filename);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Portrait Letter
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 0,
    y: 720,
    width: 612,
    height: 72,
    color: rgb(0.04, 0.07, 0.16),
  });

  page.drawText('ARCHISTORE OFFICIAL HIGH-RES CONSTRUCTION PACKAGE', {
    x: 40,
    y: 748,
    size: 14,
    font,
    color: rgb(0.96, 0.62, 0.04),
  });

  page.drawText(title.toUpperCase(), {
    x: 40,
    y: 670,
    size: 20,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText('SINGLE-BUILD AUTHORIZED LICENSEE COPY', {
    x: 40,
    y: 645,
    size: 12,
    font: bodyFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawRectangle({
    x: 40,
    y: 100,
    width: 532,
    height: 500,
    borderColor: rgb(0.1, 0.2, 0.4),
    borderWidth: 2,
    color: rgb(0.97, 0.98, 1.0),
  });

  page.drawText('FULL ARCHITECTURAL BLUEPRINT SET & ELEVATIONS', {
    x: 80,
    y: 560,
    size: 14,
    font,
    color: rgb(0.1, 0.2, 0.4),
  });

  page.drawText('• Sheet A-1: Foundation & Framing Plan\n• Sheet A-2: Dimensioned First Floor Plan\n• Sheet A-3: Exterior Elevations & Roof Details\n• Sheet A-4: Building Sections & Wall Assembly\n• Sheet E-1: Electrical & Plumbing Schematic Layout', {
    x: 80,
    y: 440,
    size: 12,
    font: bodyFont,
    color: rgb(0.2, 0.2, 0.2),
    lineHeight: 22,
  });

  page.drawRectangle({
    x: 60,
    y: 40,
    width: 492,
    height: 40,
    color: rgb(0.9, 0.95, 0.9),
  });

  page.drawText('SECURITY VERIFIED: High-resolution printing enabled. Single-build license terms active.', {
    x: 75,
    y: 55,
    size: 9,
    font: bodyFont,
    color: rgb(0.1, 0.4, 0.1),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`Created private construction PDF: ${filePath}`);
}

async function main() {
  console.log('Seeding architectural stock plans database...');

  // Create sample PDFs in private_storage/
  await createSamplePdf('fairview-construction-set.pdf', 'The Fairview Modern Farmhouse');
  await createSamplePdf('aspen-construction-set.pdf', 'The Aspen Luxury Craftsman');
  await createSamplePdf('minimalist-construction-set.pdf', 'The Minimalist Modern Pavilion');

  // Clear existing
  await prisma.auditLog.deleteMany({});
  await prisma.downloadToken.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.planImage.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.adminUser.deleteMany({});

  // Seed Admin Account with Encrypted Password
  const adminPassword = process.env.ADMIN_PASSWORD || 'DoamneAjuta2026';
  const { hash: passwordHash, salt } = hashPassword(adminPassword);
  await prisma.adminUser.create({
    data: {
      username: 'admin',
      passwordHash,
      salt,
    },
  });

  // Plan 1: Modern Farmhouse
  const plan1 = await prisma.plan.create({
    data: {
      title: 'The Fairview Modern Farmhouse',
      slug: 'fairview-modern-farmhouse',
      description: 'Stunning 2-story modern farmhouse featuring a sprawling open-concept great room, wraparound front porch, luxury primary main-floor suite, and versatile bonus space over the 2-car garage.',
      sqm: 228,
      bedrooms: 4,
      bathrooms: 3.5,
      stories: 2,
      garageSpaces: 2,
      widthM: 13.7,
      depthM: 16.8,
      style: 'Farmhouse',
      foundationType: 'Slab',
      ceilingHeight: '2.7m First / 2.7m Second / 3.7m Vaulted Great Room',
      roofPitch: '40° (10:12) Main / 18° (4:12) Porch',
      price: 1250.00,
      isPublished: true,
      featured: true,
      pdfFileName: 'fairview-construction-set.pdf',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            caption: 'Front Exterior Render',
            isFloorPlan: false,
            sortOrder: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
            caption: 'Rear Patio & Exterior',
            isFloorPlan: false,
            sortOrder: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            caption: 'Main Level Floor Plan Layout',
            isFloorPlan: true,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Plan 2: Luxury Craftsman
  const plan2 = await prisma.plan.create({
    data: {
      title: 'The Aspen Luxury Craftsman',
      slug: 'aspen-luxury-craftsman',
      description: 'An architectural masterpiece boasting timber frame exterior accents, massive stone fireplace in the two-story hearth room, 5 bedrooms, and an expandable full daylight basement foundation.',
      sqm: 353,
      bedrooms: 5,
      bathrooms: 4.5,
      stories: 2,
      garageSpaces: 3,
      widthM: 18.9,
      depthM: 20.7,
      style: 'Craftsman',
      foundationType: 'Basement',
      ceilingHeight: '3.0m First / 2.7m Second / 5.5m Cathedral Great Room',
      roofPitch: '45° (12:12) Timber Gables',
      price: 1850.00,
      isPublished: true,
      featured: true,
      pdfFileName: 'aspen-construction-set.pdf',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            caption: 'Timber Craftsman Elevation',
            isFloorPlan: false,
            sortOrder: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            caption: 'Daylight Basement Floor Plan Preview',
            isFloorPlan: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  // Plan 3: Minimalist Modern Pavilion
  const plan3 = await prisma.plan.create({
    data: {
      title: 'The Minimalist Modern Pavilion',
      slug: 'minimalist-modern-pavilion',
      description: 'Sleek single-story contemporary residence designed for modern indoor-outdoor living, with floor-to-ceiling glass walls, minimalist roofline, and zero wasted hallway space.',
      sqm: 156,
      bedrooms: 3,
      bathrooms: 2.0,
      stories: 1,
      garageSpaces: 2,
      widthM: 11.6,
      depthM: 14.6,
      style: 'Modern',
      foundationType: 'Crawlspace',
      ceilingHeight: '3.0m Flat Monolithic Ceilings',
      roofPitch: '5° (1:12) Low-Slope Metal',
      price: 950.00,
      isPublished: true,
      featured: true,
      pdfFileName: 'minimalist-construction-set.pdf',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
            caption: 'Contemporary Pavilion Front',
            isFloorPlan: false,
            sortOrder: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
            caption: 'Single Level Floor Plan Layout',
            isFloorPlan: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  console.log(`Seeding completed! Created plans: ${plan1.title}, ${plan2.title}, ${plan3.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
