import api from "@/lib/api";
import ApiResult from "@/types/api-result.dto";
import PublicUserDto from "@/types/public-user.dto";

export interface LoginUserResultDto {
  accessToken: string;
  refreshToken: string;
  user: PublicUserDto;
}

export interface RefreshTokenResultDto {
  accessToken: string;
  refreshToken: string;
}

export async function login(id: string, password: string): Promise<ApiResult<LoginUserResultDto>> {
  const response = await api.post<ApiResult<LoginUserResultDto>>('/api/v1/auth/login', {
    id,
    password,
  });
  return response.data;
}

export async function register(params: {
  loginId: string;
  email: string;
  displayName: string;
  password: string;
}): Promise<ApiResult<PublicUserDto>> {
  const response = await api.post<ApiResult<PublicUserDto>>('/api/v1/auth/register', params);
  return response.data;
}

export async function refreshToken(refreshToken: string): Promise<ApiResult<RefreshTokenResultDto>> {
  const response = await api.post<ApiResult<RefreshTokenResultDto>>('/api/v1/auth/refresh', {
    refreshToken,
  });
  return response.data;
}

const authApi = {
  login,
  register,
  refreshToken,
};
export default authApi;