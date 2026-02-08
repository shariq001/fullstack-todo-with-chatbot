import { NextRequest, NextResponse } from 'next/server';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import crypto from 'crypto';

// Enable WebSocket for serverless environments (Vercel)
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const SECRET = process.env.BETTER_AUTH_SECRET!;

function base64url(data: string): string {
  return Buffer.from(data).toString('base64url');
}

function createJWT(payload: Record<string, any>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + 86400, // 24 hours
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    let sessionToken = sessionMatch ? decodeURIComponent(sessionMatch[1]) : null;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    // Better Auth stores token with signature (token.signature), extract just the token part
    const tokenPart = sessionToken.split('.')[0];

    // Look up session in PostgreSQL database
    const result = await pool.query(
      'SELECT s.*, u.id as "userId", u.email, u.name FROM "session" s JOIN "user" u ON s."userId" = u.id WHERE s.token = $1',
      [tokenPart]
    );

    const session = result.rows[0];

    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Check if session is expired
    const expiresAt = new Date(session.expiresAt).getTime();
    if (expiresAt < Date.now()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Create JWT with user info
    const jwt = createJWT({
      sub: session.userId,
      email: session.email,
      name: session.name,
    });

    return NextResponse.json({ token: jwt });
  } catch (error: any) {
    console.error('[JWT Generation Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
