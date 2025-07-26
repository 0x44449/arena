import api from "./api.axios";
import { CreateChannelDto, ChannelDto } from "./generated";
import { ApiResultDto } from "./models/api-result";

async function getChannelsByTeamId(teamId: string) {
  const response = await api.get<ApiResultDto<ChannelDto[]>>(`/api/v1/teams/${teamId}/channels`);
  return response.data;
}

async function createChannel(param: CreateChannelDto) {
  const response = await api.post<ApiResultDto<ChannelDto>>(`/api/v1/channels`, param);
  return response.data;
}

async function getChannelByChannelId(channelId: string) {
  const response = await api.get<ApiResultDto<ChannelDto>>(`/api/v1/channels/${channelId}`);
  return response.data;
}

const channelApi = {
  getChannelsByTeamId,
  createChannel,
  getChannelByChannelId,
}
export default channelApi;