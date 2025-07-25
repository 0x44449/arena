import { ArenaAuthTokenDto, RefreshArenaTokenDto } from "@/api/generated";
import { ApiResultDto } from "@/api/models/api-result";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('arena_session')?.value;
  const refreshToken = request.cookies.get('arena_session_refresh')?.value;

  if (!accessToken || !refreshToken) {
    return new Response(JSON.stringify({
      success: false,
      errorCode: 'TOKEN_EXCHANGE_FAILED',
      data: null,
    }));
  }

  const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    } satisfies RefreshArenaTokenDto),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({
      success: false,
      errorCode: 'TOKEN_REFRESH_FAILED',
      data: null,
    }));
  }

  const result = await response.json() as ApiResultDto<ArenaAuthTokenDto>;

  if (!result.success) {
    // 세션 쿠키 제거
    const headers = new Headers();
    headers.append('Set-Cookie', `arena_session=; Domain=${process.env.SESSION_COOKIE_DOMAIN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
    headers.append('Set-Cookie', `arena_session_refresh=; Domain=${process.env.SESSION_REFRESH_COOKIE_DOMAIN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);

    return new Response(JSON.stringify({
      success: false,
      errorCode: result.errorCode || 'TOKEN_REFRESH_FAILED',
      data: null,
    }), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }

  const headers = new Headers(response.headers);
  headers.append('Set-Cookie', `arena_session=${result.data.accessToken}; Domain=${process.env.SESSION_COOKIE_DOMAIN}; Path=/; HttpOnly; Secure; SameSite=Lax`);
  headers.append('Set-Cookie', `arena_session_refresh=${result.data.refreshToken}; Domain=${process.env.SESSION_REFRESH_COOKIE_DOMAIN}; Path=/; HttpOnly; Secure; SameSite=Strict`);

  return new Response(JSON.stringify(result), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}