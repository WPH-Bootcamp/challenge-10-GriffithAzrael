import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Baca dari env saja, tidak ada fallback hard-coded
  const rawBaseUrl = process.env.BACKEND_API_BASE_URL;

  if (!rawBaseUrl) {
    console.error('BACKEND_API_BASE_URL is not defined');
    return NextResponse.json(
      {
        message:
          'BACKEND_API_BASE_URL is not configured on the server. Please set it in .env/.env.local.',
      },
      { status: 500 }
    );
  }

  const backendBaseUrl = rawBaseUrl.replace(/\/+$/, ''); // buang trailing slash
  const { search } = new URL(req.url); // contoh: ?limit=5&page=1
  const targetUrl = `${backendBaseUrl}/posts/recommended${search}`;

  try {
    const res = await fetch(targetUrl, {
      headers: { Accept: 'application/json' },
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('Error proxying /posts/recommended:', error);
    return NextResponse.json(
      { message: 'Failed to fetch recommended posts from backend.' },
      { status: 500 }
    );
  }
}
