import PublicUserDto from "@/types/public-user.dto"

interface ProfileCardProps {
  user: PublicUserDto;
}

export function ProfileCard(props: ProfileCardProps) {
  const user = props.user;

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