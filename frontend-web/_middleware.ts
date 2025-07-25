import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 필요 없는 공개 페이지들
const PUBLIC_PATHS = ['/login', '/register'];

// 로그인 필요 경로 (public이 아닌 모든 경로)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('arena_session')?.value;
  console.log('Current path:', pathname, 'Token:', token);

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));
  const isAuthPage = ['/login', '/register'].some(p => pathname === p);

  // 1) 로그인 필요 경로인데 토큰 없으면 → 로그인 페이지로
  if (!isPublic && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2) 비로그인 전용(login/register)인데 이미 로그인 상태면 → 메인으로
  if (isAuthPage && token) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 나머지는 그대로 통과
  return NextResponse.next();
}

// 적용할 경로 패턴
export const config = {
  matcher: ['/((?!_next|api|static).*)'], 
};