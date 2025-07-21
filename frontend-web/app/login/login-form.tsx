'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useGoogleLogin from "./google-login.hook";
import { useEffect, useState } from "react";
import userApi from "@/api/user-api";
import { useRouter } from "next/navigation";
import { auth } from "@/plugins/firebase.plugin";

interface SocialProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  onClick: () => void;
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle } = useGoogleLogin();
  const router = useRouter();

  useEffect(() => {
    handleAuthStateChange();
  }, [auth]);

  const handleAuthStateChange = async () => {
    const user = auth.currentUser;
    console.log('Current user:', user);

    if (user) {
      // 사용자 정보 획득
      const userResult = await userApi.getMe();

      if (!userResult.success) {
        if (userResult.errorCode === 'USER_NOT_FOUND') {
          // 사용자 정보가 없으면 새로 등록 페이지로 이동
          router.push('/register');
        } else {
          // 다른 에러 처리
          console.error('Failed to fetch user info:', userResult.errorCode);
        }
        return;
      }

      // 사용자 정보가 있으면 메인 페이지로 이동
      router.push('/gate');
    }
  }

  const socialProviders: SocialProvider[] = [
    {
      id: 'google',
      name: 'Google로 로그인',
      icon: <img src="/icon-google.svg" alt="Google Icon" className="w-5 h-5" />,
      enabled: true,
      onClick: async () => {
        setIsLoading(true);
        try {
          await loginWithGoogle();
        } finally {
          setIsLoading(false);
        }
      }
    },
    // {
    //   id: 'instagram',
    //   name: 'Instagram으로 로그인',
    //   icon: <Instagram className="w-5 h-5" />,
    //   enabled: false, // 아직 비활성화
    //   onClick: () => {
    //     console.log('Instagram 로그인 클릭됨');
    //   }
    // },
  ];
  const enabledProviders = socialProviders.filter(provider => provider.enabled);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center space-y-2 pb-8 pt-8">
          {/* 로고 영역 */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-3xl p-2">
                <img
                  src="/arena_logo.png"
                  alt="arena logo"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              {/* 로고 주변 장식 링 */}
              <div className="absolute inset-0 rounded-3xl border-2 border-purple-200/50 animate-pulse"></div>
            </div>
          </div>

          {/* 브랜드명 */}
          <div className="space-y-3">
            <CardTitle className="text-4xl bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent tracking-tight">
              arena
            </CardTitle>
            <CardDescription className="text-purple-600/70 text-base">
              소셜 계정으로 간편하게 로그인하세요
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-4">
            {enabledProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                size="lg"
                onClick={provider.onClick}
                className="w-full h-12 flex items-center justify-center gap-3 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 border-purple-100 text-purple-700 hover:text-purple-800 shadow-sm hover:shadow-md"
                disabled={isLoading}
              >
                {provider.icon}
                <span>{provider.name}</span>
              </Button>
            ))}
          </div>

          {/* 준비 중인 소셜 로그인 미리보기 (개발용 - 실제로는 제거 가능) */}
          {socialProviders.some(p => !p.enabled) && (
            <>
              <Separator className="my-8 bg-purple-100" />
              <div className="text-center text-sm text-purple-500/70 mb-4">
                곧 추가될 로그인 방법
              </div>
              <div className="space-y-3">
                {socialProviders
                  .filter(provider => !provider.enabled)
                  .map((provider) => (
                    <Button
                      key={provider.id}
                      variant="outline"
                      size="lg"
                      disabled
                      className="w-full h-12 flex items-center justify-center gap-3 opacity-40 border-purple-100/50 text-purple-400"
                    >
                      {provider.icon}
                      <span>{provider.name}</span>
                      <span className="text-xs bg-purple-50 text-purple-500 px-2 py-1 rounded ml-auto">준비중</span>
                    </Button>
                  ))}
              </div>
            </>
          )}

          {/* 하단 안내 문구 */}
          <div className="pt-8 text-center">
            <p className="text-xs text-purple-500/60 leading-relaxed">
              로그인하면 arena의{' '}
              <a href="#" className="underline hover:text-purple-700 transition-colors">이용약관</a> 및{' '}
              <a href="#" className="underline hover:text-purple-700 transition-colors">개인정보처리방침</a>에 동의하게 됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}