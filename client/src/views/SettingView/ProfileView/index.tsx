import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store"
import PublicUserDto from "@/types/public-user.dto";
import { useState } from "react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";

export default function ProfileView() {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const navigation = useNavigation();

  const storedUser = useUserStore((state) => state.user);
  const [user, setUser] = useState(storedUser as PublicUserDto);

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({
      ...prev,
      displayName: e.target.value
    }));
  }

  const handleOKClick = () => {

  }

  return (
    <div className="flex flex-col">
      <div>
        <span>이름</span>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 w-full mt-1"
          placeholder="이름을 입력하세요"
          value={user.displayName}
          onChange={handleDisplayNameChange}
        />
      </div>

      <div>
        <span>아바타</span>
        <input
          type="file"
          accept="image/*"
          className="border border-gray-300 rounded-md p-2 w-full mt-1"
          placeholder="아바타를 업로드하세요"
        />
      </div>

      <div className="mt-4">
        <Button onClick={handleOKClick}>
          저장
        </Button>
      </div>
    </div>
  )
}