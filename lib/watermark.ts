import sharp from 'sharp';

/**
 * Superimposes a diagonal semi-transparent copyright watermark overlay on top of an image buffer or file path.
 */
export async function watermarkImage(inputImage: Buffer | string): Promise<Buffer> {
  const image = sharp(inputImage);
  const metadata = await image.metadata();

  const width = metadata.width || 1200;
  const height = metadata.height || 800;

  // Generate SVG watermark overlay matching dimensions
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .watermark-text {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: ${Math.max(24, Math.floor(width / 22))}px;
          font-weight: 900;
          fill: rgba(220, 38, 38, 0.45);
          letter-spacing: 4px;
        }
        .watermark-sub {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: ${Math.max(16, Math.floor(width / 36))}px;
          font-weight: 700;
          fill: rgba(30, 41, 59, 0.50);
          letter-spacing: 2px;
        }
      </style>
      <g transform="rotate(-30, ${width / 2}, ${height / 2})">
        <rect x="${width * -0.2}" y="${height * 0.35}" width="${width * 1.4}" height="${height * 0.3}" fill="rgba(255, 255, 255, 0.65)" rx="12" />
        <text x="50%" y="47%" text-anchor="middle" dominant-baseline="middle" class="watermark-text">
          ARCHISTORE COPYRIGHT PREVIEW
        </text>
        <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" class="watermark-sub">
          SINGLE-BUILD LICENSE REQUIRED • CONCEPTUAL PLAN ONLY
        </text>
      </g>
    </svg>
  `);

  return await image
    .composite([
      {
        input: svgOverlay,
        blend: 'over',
      },
    ])
    .webp({ quality: 85 })
    .toBuffer();
}
