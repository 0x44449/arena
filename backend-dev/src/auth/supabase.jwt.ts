import { createRemoteJWKSet, jwtVerify } from "jose";

export async function verifySupabaseJwt(token: string) {
  const JWKS = createRemoteJWKSet(new URL("https://jzchrzorkmkfxvixctdw.supabase.co/auth/v1/.well-known/jwks.json"));
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: "https://jzchrzorkmkfxvixctdw.supabase.co/auth/v1",
  });

  return payload;
}