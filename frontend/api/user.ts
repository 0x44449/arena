import api from "./api.axios";
import { RegisterUserDto, UserDto } from "./generated";
import { ApiResult } from "./models/api-result";

async function getMe() {
  const response = await api.get<ApiResult<UserDto>>('/api/v1/users/me');
  return response.data;
}

async function registerUser(user: RegisterUserDto) {
  const response = await api.post<ApiResult<UserDto>>('/api/v1/users', user);
  return response.data;
}

const userApi = {
  getMe,
  registerUser,
};
export default userApi;
