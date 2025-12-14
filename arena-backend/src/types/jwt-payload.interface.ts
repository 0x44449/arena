/**
 * Supabase JWT Payload
 * JWT의 validate에서 반환하는 사용자 정보
 */
export interface JwtPayload {
  uid: string;
  email: string;
}
