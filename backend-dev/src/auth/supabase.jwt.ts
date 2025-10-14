import { createRemoteJWKSet, JWTPayload, jwtVerify } from "jose";

export interface SupabasePayload extends JWTPayload {
  email: string;
}

export async function verifySupabaseJwt(token: string): Promise<SupabasePayload> {
  const JWKS = createRemoteJWKSet(new URL("https://jzchrzorkmkfxvixctdw.supabase.co/auth/v1/.well-known/jwks.json"));
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: "https://jzchrzorkmkfxvixctdw.supabase.co/auth/v1",
  });

  return payload as SupabasePayload;
}