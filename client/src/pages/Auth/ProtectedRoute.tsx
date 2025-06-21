import TokenManager from "@/lib/token-manager";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = TokenManager.getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>{children}</>
  )
}