// Session encryption utilities for STRATA
// Uses JWE with A256GCM for stateless session cookies

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

async function getKey(): Promise<CryptoKey> {
  const keyStr = process.env.SESSION_ENCRYPTION_KEY || 'default-dev-key-change-in-production-min-64-chars!!!!';
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(keyStr),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('strata-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface SessionPayload {
  userId: string;
  tenantId: string;
  planTier: string;
  iat: number;
  exp: number;
}

export async function encryptSession(payload: Omit<SessionPayload, 'iat' | 'exp'>): Promise<string> {
  const key = await getKey();
  const encoder = new TextEncoder();
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: SessionPayload = {
    ...payload,
    iat: now,
    exp: now + 60 * 60 * 24 * 30, // 30 days
  };

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(JSON.stringify(fullPayload));

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  );

  // Combine IV + ciphertext and base64url encode
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const key = await getKey();
    const decoder = new TextDecoder();

    // Base64url decode
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const combined = new Uint8Array(
      atob(padded).split('').map(c => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext
    );

    const payload = JSON.parse(decoder.decode(decrypted)) as SessionPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}
