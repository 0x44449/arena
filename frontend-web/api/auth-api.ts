import api from "./api.axios";
import { ArenaAuthTokenDto, RegisterUserWithProviderDto, UserDto } from "./generated";
import { ApiResultDto } from "./models/api-result";
import { AuthExchangeDto } from "./models/auth-exchange.dto";

async function exchangeAuth(param: AuthExchangeDto) {
  const response = await api.frontend.post<ApiResultDto<ArenaAuthTokenDto>>('/api/auth/exchange', param);
  return response.data;
}

async function refresh() {
  const response = await api.frontend.post<ApiResultDto<ArenaAuthTokenDto>>('/api/auth/refresh');
  return response.data;
}

async function register(param: RegisterUserWithProviderDto) {
  const response = await api.post<ApiResultDto<UserDto>>(`/api/v1/auth/register`, param);
  return response.data;
}

const authApi = {
  exchangeAuth,
  refresh,
  register,
};

export default authApi;