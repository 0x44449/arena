import { PublicUserDto } from "@/dto/public-user.dto";

export class LoginUserResultDto {
  accessToken: string;
  refreshToken: string;
  user: PublicUserDto;
}