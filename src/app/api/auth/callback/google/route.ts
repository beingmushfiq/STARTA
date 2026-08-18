// Google OAuth 2.0 PKCE callback handler
// Creates user + tenant on first login, returns session cookie

import { NextRequest, NextResponse } from 'next/server';
import { encryptSession } from '@/lib/auth/crypto';

// In production, this would use the Google Auth Library and a real database
// This is the handler structure as specified in the STRATA spec

export async function POST(req: NextRequest) {
  try {
    const { code, codeVerifier } = await req.json();

    // In production:
    // 1. Exchange code for tokens with Google
    // 2. Verify ID token
    // 3. Extract user info (sub, email, name, picture)
    // 4. Create/find user + tenant in database (atomic transaction)
    // 5. Create welcome bookmarks

    // Mock for demo purposes
    const mockUser = {
      userId: 'user_demo_1',
      tenantId: 'tenant_demo_1',
      planTier: 'pro',
    };

    const sessionToken = await encryptSession({
      userId: mockUser.userId,
      tenantId: mockUser.tenantId,
      planTier: mockUser.planTier,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: mockUser.userId,
        email: 'demo@strata.design',
        displayName: 'Demo User',
        avatarUrl: null,
      },
    });

    response.cookies.set('__Host-strata-session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
