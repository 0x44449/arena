import api from "@/lib/api";
import ApiResult from "@/types/api-result.dto";
import PublicUserDto from "@/types/public-user.dto";

export interface LoginUserResultDto {
  accessToken: string;
  refreshToken: string;
  user: PublicUserDto;
}

export async function login(id: string, password: string): Promise<ApiResult<LoginUserResultDto>> {
  const response = await api.post<ApiResult<LoginUserResultDto>>('/api/v1/auth/login', {
    id,
    password,
  });
  return response.data;
}