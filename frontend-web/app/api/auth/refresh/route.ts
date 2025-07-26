import { ArenaAuthTokenDto, RefreshArenaTokenDto } from "@/api/generated";
import { ApiResultDto } from "@/api/models/api-result";
import { NextRequest, NextResponse } from "next/server";

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
    const errorRes = NextResponse.json(result);

    errorRes.cookies.set('arena_session', '', {
      domain: process.env.SESSION_COOKIE_DOMAIN,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0,
    });
    errorRes.cookies.set('arena_session_refresh', '', {
      domain: process.env.SESSION_REFRESH_COOKIE_DOMAIN,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0,
    });

    return errorRes;
  }

  const res = NextResponse.json(result);

  res.cookies.set('arena_session', result.data.accessToken, {
    domain: process.env.SESSION_COOKIE_DOMAIN,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 5, // 5 days
  });
  res.cookies.set('arena_session_refresh', result.data.refreshToken, {
    domain: process.env.SESSION_REFRESH_COOKIE_DOMAIN,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 5, // 5 days
  });

  return res;
}