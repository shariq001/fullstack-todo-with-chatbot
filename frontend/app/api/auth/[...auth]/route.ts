import { NextRequest, NextResponse } from 'next/server';
import { betterAuth } from 'better-auth';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Enable WebSocket for serverless environments (Vercel)
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  database: pool,
  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

export async function GET(request: NextRequest) {
  try {
    return await auth.handler(request);
  } catch (error: any) {
    console.error('[Auth GET Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await auth.handler(request);
  } catch (error: any) {
    console.error('[Auth POST Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
