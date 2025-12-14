import { IsEmail, IsOptional, IsString, IsUUID, Length, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsUUID()
  uid: string;

  @IsString()
  @Length(1, 32)
  nick: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  statusMessage?: string;
}
