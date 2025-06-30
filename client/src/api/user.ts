import api from "@/lib/api";
import ApiResult from "@/types/api-result.dto";
import PublicUserDto from "@/types/public-user.dto";

export async function getMe(): Promise<ApiResult<PublicUserDto | null>> {
  const response = await api.get<ApiResult<PublicUserDto | null>>(`/api/v1/users/me`);
  return response.data;
}

const userApi = {
  getMe,
};
export default userApi;