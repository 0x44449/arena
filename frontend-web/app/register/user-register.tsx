'use client';

import userApi from "@/api/user-api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/plugins/firebase.plugin";
import { Edit3, Mail, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || '');
      setDisplayName(user.displayName || '');
      console.log('Current user:', user);
      user.getIdToken().then(token => {
        console.log('User token:', token);
      });
    }
  }, []);

  const handleRegisterClick = async () => {
    console.log('Register button clicked');
    if (isLoading) return;
    setIsLoading(true);
    setErrors({});

    try {
      const user = auth.currentUser;
      if (!user) {
        //TODO: 사용자 정보가 없습니다. 다시 로그인해주세요.
        console.error('No user is currently logged in.');
        return;
      }

      const token = await user.getIdToken(false);
      const provider = user.providerId;

      const result = await userApi.registerUser({
        email: user.email || '',
        displayName: displayName,
        provider: provider,
        token: token,
      });

      if (!result.success) {
        //TODO: 사용자 등록에 실패했습니다. 다시 시도해주세요.
        console.error('User registration failed:', result);
        return;
      }

      // 등록 성공 시 처리
      router.push("/arena");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center space-y-6 pb-6">
          {/* 로고 영역 */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-2">
                <img
                  src="/arena_logo.png"
                  alt="arena logo"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              환영합니다!
            </CardTitle>
            <CardDescription className="text-purple-600/70">
              arena 사용을 위해 프로필을 설정해주세요
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          <div className="space-y-6">
            {/* 아바타 업로드 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-purple-100 transition-all duration-200 group-hover:border-purple-200">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 text-2xl">
                    <User className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  // onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-600/80">프로필 사진 선택</p>
                <p className="text-xs text-purple-500/60">JPG, PNG 파일 (최대 5MB)</p>
              </div>
              {errors.avatar && (
                <p className="text-sm text-red-500 text-center">{errors.avatar}</p>
              )}
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                이메일 주소
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                // onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                disabled
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* 별명 입력 */}
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-purple-700 flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                별명
              </Label>
              <Input
                id="nickname"
                type="text"
                placeholder="사용할 별명을 입력해주세요"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                maxLength={20}
              />
              <div className="flex justify-between text-xs text-purple-500/60">
                <span>{errors.nickname || ''}</span>
                {/* <span>{formData.nickname.length}/20</span> */}
              </div>
            </div>

            {/* 완료 버튼 */}
            <Button
              disabled={isLoading}
              onClick={handleRegisterClick}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  처리중...
                </div>
              ) : (
                '프로필 설정 완료'
              )}
            </Button>
          </div>

          {/* 하단 안내 문구 */}
          <div className="text-center pt-4">
            <p className="text-xs text-purple-500/60 leading-relaxed">
              언제든지 설정에서 프로필을 변경할 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}