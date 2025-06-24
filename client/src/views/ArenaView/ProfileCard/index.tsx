import { useMeQuery } from "@/api/user.hook";
import { useUserStore } from "@/stores/user-store";
import { Settings } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  className?: string;
}

export function ProfileCard(props: ProfileCardProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { data: fetchedUser } = useMeQuery({
    options: {
      enabled: !user
    }
  });

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  if (!user) {
    return <div className="text-gray-500">No user data available</div>;
  }

  return (
    <div className={`flex flex-row items-center space-x-4 p-2 bg-gray-200 shadow rounded-lg ${props.className}`}>
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
        to="/settings/profile"
      >
        <Settings size={24} strokeWidth={1.5} />
      </Link>
    </div>
  )
}