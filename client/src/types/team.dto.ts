import PublicUserDto from "./public-user.dto";

export default interface TeamDto {
  teamId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  owner: PublicUserDto | null;
}