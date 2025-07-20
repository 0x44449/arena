'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera, Upload, User } from "lucide-react";
import { useRef, useState } from "react";

interface UserProfile {
  name: string;
  message: string;
  avatar: string | null;
}

export default function ProfileSetting() {
  const [profileData, setProfileData] = useState<UserProfile>({
    name: '',
    message: '',
    avatar: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-gray-800 text-lg font-semibold mb-2">내 프로필</h2>
        <p className="text-[#6B7280] text-sm">
          다른 사용자들에게 보여질 프로필 정보를 설정하세요.
        </p>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div>
          <Label className="text-gray-700 font-medium mb-3 block">아바타</Label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-[#8B5CF6] flex items-center justify-center">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center hover:bg-[#7C3AED] transition-colors duration-150"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-[#E5E7EB] text-gray-700 hover:bg-[#F9FAFB] hover:border-[#D1D5DB]"
              >
                <Upload className="w-4 h-4 mr-2" />
                이미지 업로드
              </Button>
              <p className="text-xs text-[#6B7280] mt-1">
                JPG, PNG 파일만 업로드 가능합니다.
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            // onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <Separator />

        {/* Name Section */}
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-gray-700 font-medium">
            표시 이름
          </Label>
          <Input
            id="displayName"
            type="text"
            placeholder="이름을 입력하세요"
            value={profileData.name}
            // onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-[#F9FAFB] border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-2 focus:ring-opacity-20 text-gray-800"
            maxLength={32}
          />
          <div className="text-xs text-[#6B7280] text-right">
            {profileData.name.length}/32
          </div>
        </div>

        {/* Status Message Section */}
        <div className="space-y-2">
          <Label htmlFor="statusMessage" className="text-gray-700 font-medium">
            상태 메시지
          </Label>
          <Input
            id="statusMessage"
            type="text"
            placeholder="상태 메시지를 입력하세요"
            value={profileData.message}
            // onChange={(e) => handleInputChange('message', e.target.value)}
            className="bg-[#F9FAFB] border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-2 focus:ring-opacity-20 text-gray-800"
            maxLength={128}
          />
          <div className="text-xs text-[#6B7280] text-right">
            {profileData.message.length}/128
          </div>
        </div>

        <Separator />

        {/* Preview Section */}
        <div>
          <Label className="text-gray-700 font-medium mb-3 block">미리보기</Label>
          <div className="bg-[#F5F3FF] rounded-lg p-4 border border-[#E5E7EB]">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-800 font-medium">
                  {profileData.name || '이름'}
                </div>
                {profileData.message && (
                  <div className="text-[#6B7280] text-sm mt-0.5">
                    {profileData.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}