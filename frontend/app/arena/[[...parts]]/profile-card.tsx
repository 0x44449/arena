'use client';

import userApi from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
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
    return <div className="text-gray-500">No user data available</div>;
  }
  return (
    <div className={`flex flex-row items-center space-x-4 p-2 bg-gray-200 shadow rounded-lg mx-2 mb-2`}>
      <img
        src={user.avatarUrl}
        alt={user.displayName}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col flex-1">
        <h2 className="text-xl font-semibold">{user.displayName}</h2>
        {/* <p className="text-gray-600">{user.email}</p> */}
      </div>
      <Link
        className="cursor-pointer text-gray-500 hover:text-gray-700 transition p-1.5 rounded-full hover:bg-gray-400"
        href="/settings/profile"
      >
        <Settings size={24} strokeWidth={1.5} />
      </Link>
    </div>
  )
}