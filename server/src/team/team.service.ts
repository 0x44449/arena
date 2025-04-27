import { TeamEntity } from "@/entity/team.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTeamDto } from "./dto/create-team.dto";
import { TeamDto } from "@/dto/team.dto";
import { UserService } from "@/user/user.service";
import { PublicUserDto } from "@/dto/public-user.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { nanoid } from "nanoid";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly userService: UserService
  ) {}

  async createTeam(param: CreateTeamDto, ownerId: string): Promise<TeamDto> {
    const { name, description } = param;
    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    // TODO: 권한처리
    // Team 생성
    const team = await this.teamRepository.save<Partial<TeamEntity>>({
      teamId: nanoid(12),
      name,
      description,
      ownerId,
    });
    if (!team) {
      throw new Error("Failed to create team");
    }
    const teamDto = new TeamDto(team);

    // User 매핑
    const user = await this.userService.getUserByUserId(ownerId);
    if (user) {
      teamDto.owner = new PublicUserDto(user);
    }

    return teamDto;
  }

  async updateTeam(teamId: string, param: UpdateTeamDto, ownerId: string): Promise<TeamDto | null> {
    const { name, description } = param;
    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    // TODO: 권한처리
    // Team 업데이트
    await this.teamRepository.update(
      { teamId: teamId },
      { name, description }
    );
    const team = await this.teamRepository.findOne({
      where: { teamId }
    });
    if (!team) return null;

    const teamDto = new TeamDto(team);

    // User 매핑
    const user = await this.userService.getUserByUserId(ownerId);
    if (user) {
      teamDto.owner = new PublicUserDto(user);
    }

    return teamDto;
  }

  async deleteTeam(teamId: string, ownerId: string): Promise<void> {
    // TODO: 권한처리
    const team = await this.teamRepository.findOne({
      where: { teamId, ownerId },
    });
    if (!team) return;

    await this.teamRepository.delete(teamId);
  }

  async getTeamByTeamId(teamId: string): Promise<TeamDto | null> {
    // TODO: 권한처리
    const team = await this.teamRepository.findOne({
      where: { teamId },
    });
    if (!team) return null;

    const teamDto = new TeamDto(team);

    // User 매핑
    const user = await this.userService.getUserByUserId(team.ownerId);
    if (user) {
      teamDto.owner = new PublicUserDto(user);
    }

    return teamDto;
  }

  async getTeams(): Promise<TeamDto[]> {
    // TODO: 권한처리
    const teams = await this.teamRepository.find();

    // User 매핑
    // TOOD: 성능개선
    const teamDtos = await Promise.all(
      teams.map(async (team) => {
        const user = await this.userService.getUserByUserId(team.ownerId);

        const teamDto = new TeamDto(team);
        if (user) {
          teamDto.owner = new PublicUserDto(user);
        }
        return teamDto;
      })
    );

    return teamDtos;
  }
}