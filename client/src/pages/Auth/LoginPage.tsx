import { login } from "@/api/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (id && password) {
      try {
        const result = await login(id, password);
        if (result.success) {
          localStorage.setItem("accessToken", result.data.accessToken);
          localStorage.setItem("refreshToken", result.data.refreshToken);
          navigate("/arena");
        } else {
          alert(result.errorCode);
        }
      } catch (error) {
        console.error("Login failed:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
        
        <input
          type="text"
          placeholder="아이디"
          className="w-full mb-4 px-4 py-2 border rounded-lg text-sm"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full mb-6 px-4 py-2 border rounded-lg text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
        >
          로그인
        </button>
      </div>
    </div>
  )
}