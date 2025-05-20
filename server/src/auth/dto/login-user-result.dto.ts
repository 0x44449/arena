import { PublicUserDto } from "@/dto/public-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class LoginUserResultDto {
  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;

  @ApiProperty()
  @Expose()
  user: PublicUserDto;
}