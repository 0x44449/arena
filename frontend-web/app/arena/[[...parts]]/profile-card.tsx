'use client';

import userApi from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";
import { Settings, User } from "lucide-react";
import Link from "next/link";

export default function ProfileCard() {
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

  if (!user) {
    return (
      <div className="flex flex-row bg-gray-200 items-center shadow rounded-lg p-2 mx-2 mb-2">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-800 text-sm font-medium truncate">
              이름
            </div>
            <div className="text-[#6B7280] text-xs truncate">
              메세지
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#374151] transition-colors duration-150"
            href="/setting/profile"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-row bg-gray-200 items-center shadow rounded-lg p-2 mx-2 mb-2">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-800 text-sm font-medium truncate">
            {user.displayName}
          </div>
          <div className="text-[#6B7280] text-xs truncate">
            {user.message}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {/* <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#374151] transition-colors duration-150">
          <Mic className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#374151] transition-colors duration-150">
          <Headphones className="w-4 h-4" />
        </button> */}
        <Link
          className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#374151] transition-colors duration-150"
          href="/setting/profile"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}