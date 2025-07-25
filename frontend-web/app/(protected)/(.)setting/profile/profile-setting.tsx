'use client';

import fileApi from "@/api/file-api";
import { FileDto, UpdateUserProfileDto } from "@/api/generated";
import userApi from "@/api/user-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProfileSetting() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: async () => {
      const response = await userApi.getMe();
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to fetch user data');
      }
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [name, setName] = useState(user?.displayName || '');
  const [message, setMessage] = useState(user?.message || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFileRef = useRef<FileDto | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const profileMutation = useMutation({
    mutationFn: async (profile: UpdateUserProfileDto) => {
      const response = await userApi.updateProfile(profile);
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });

  useEffect(() => {
    if (user) {
      setName(user.displayName);
      setMessage(user.message);
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await fileApi.uploadFile(file, {
        onProgress: (progress) => console.log(`Upload progress: ${progress}%`),
        onStart: () => console.log('Upload started'),
        onComplete: () => console.log('Upload completed'),
        onError: (error) => console.error('Upload error:', error),
      });

      if (response.success) {
        setAvatarUrl(response.data.url);
        uploadedFileRef.current = response.data;
        setHasChanges(true);
      } else {
        console.error('Failed to upload avatar:', response.errorCode);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);

    if (value !== user?.displayName || message !== user?.message || uploadedFileRef.current) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMessage(value);

    if (value !== user?.message || name !== user?.displayName || uploadedFileRef.current) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }

  const handleReset = () => {
    setName(user?.displayName || '');
    setMessage(user?.message || '');
    setAvatarUrl(user?.avatarUrl || null);
    uploadedFileRef.current = null;
    setHasChanges(false);
  }

  const closeSetting = () => {
    if (history.length > 1) {
      router.back();
      // 혹시 딥링크라 back 후에도 여전히 /setting/* 이면 fallback
      setTimeout(() => {
        if (location.pathname.startsWith('/setting')) {
          router.replace('/arena');
        }
      }, 40);
    } else {
      router.replace('/arena');
    }
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    if (isSaving) return;

    setIsSaving(true);

    try {
      await profileMutation.mutateAsync({
        displayName: name,
        message: message,
        avatarFileId: uploadedFileRef.current?.fileId || undefined,
      });
      closeSetting();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-2xl h-full relative flex flex-col">
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
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
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
            onChange={handleAvatarChange}
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
            value={name}
            onChange={handleNameChange}
            className="bg-[#F9FAFB] border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-2 focus:ring-opacity-20 text-gray-800"
            maxLength={32}
          />
          <div className="text-xs text-[#6B7280] text-right">
            {name.length}/32
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
            value={message}
            onChange={handleMessageChange}
            className="bg-[#F9FAFB] border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-2 focus:ring-opacity-20 text-gray-800"
            maxLength={128}
          />
          <div className="text-xs text-[#6B7280] text-right">
            {message.length}/128
          </div>
        </div>

        <Separator />

        {/* Preview Section */}
        <div>
          <Label className="text-gray-700 font-medium mb-3 block">미리보기</Label>
          <div className="bg-[#F5F3FF] rounded-lg p-4 border border-[#E5E7EB]">
            <div className="flex items-start space-x-2">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-800 text-sm font-medium truncate">
                  {name || '이름'}
                </div>
                {message && (
                  <div className="text-[#6B7280] text-xs truncate">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Bar */}
      {hasChanges && (
        <>
          <div className="flex flex-1 min-h-0"></div>
          <div className="sticky bottom-0 left-0 right-0 bg-transparent py-4 rounded-t-lg pt-10">
            <div className="bg-[#F9FAFB] px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-[#6B7280] text-sm">변경사항이 저장되지 않았습니다.</p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-[#E5E7EB] text-gray-700 hover:bg-white hover:border-[#D1D5DB]"
                  >
                    초기화
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  >
                    변경사항 저장
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}