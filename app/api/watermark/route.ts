import { NextRequest, NextResponse } from 'next/server';
import { watermarkImage } from '@/lib/watermark';
import sharp from 'sharp';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get('src');

  if (!src) {
    return NextResponse.json({ error: 'Missing image source parameter' }, { status: 400 });
  }

  try {
    let inputBuffer: Buffer;

    if (src.startsWith('http://') || src.startsWith('https://')) {
      const resp = await fetch(src);
      if (!resp.ok) throw new Error(`Failed to fetch remote image ${resp.status}`);
      const arrayBuf = await resp.arrayBuffer();
      inputBuffer = Buffer.from(arrayBuf);
    } else {
      // Create SVG placeholder graphic if local asset is referenced
      inputBuffer = await sharp({
        create: {
          width: 1200,
          height: 800,
          channels: 4,
          background: { r: 245, g: 247, b: 250, alpha: 1 },
        },
      })
        .png()
        .toBuffer();
    }

    const watermarkedBuffer = await watermarkImage(inputBuffer);

    return new NextResponse(watermarkedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err: any) {
    // Fallback simple generated floorplan preview buffer if remote fetch fails
    const fallbackBuffer = await sharp({
      create: {
        width: 1000,
        height: 700,
        channels: 4,
        background: { r: 240, g: 243, b: 248, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const watermarkedFallback = await watermarkImage(fallbackBuffer);

    return new NextResponse(watermarkedFallback, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
