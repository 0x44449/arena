import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  loginId: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsString()
  password: string;
}