import { useUserStore } from "@/stores/user-store";
import PublicUserDto from "@/types/public-user.dto"

export function ProfileCard() {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <div className="text-gray-500">No user data available</div>;
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white shadow rounded-lg">
      <img
        src={user.avatarUrl}
        alt={user.displayName}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h2 className="text-xl font-semibold">{user.displayName}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  )
}