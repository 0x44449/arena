import { TeamEntity } from "@/entities/team.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";
import { UpdateTeamDto } from "./dtos/update-team.dto";
import { WellKnownError } from "@/exceptions/well-known-error";
import { UserEntity } from "@/entities/user.entity";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity) private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async createTeam(param: { name: string; description: string; ownerId: string }): Promise<TeamEntity> {
    const team = this.teamRepository.create({
      teamId: nanoid(12),
      name: param.name,
      description: param.description,
      ownerId: param.ownerId,
    });

    await this.teamRepository.save(team);
    const saved = await this.teamRepository.findOne({
      where: { teamId: team.teamId },
      relations: ["owner"],
    });

    if (!saved) {
      throw new WellKnownError({
        message: "Failed to create team",
        errorCode: "TEAM_CREATION_FAILED",
      });
    }
    return saved;
  }

  async findTeamById(teamId: string): Promise<TeamEntity | null> {
    return await this.teamRepository.findOne({
      where: { teamId },
      relations: ["owner"],
    });
  }

  async updateTeam(teamId: string, param: UpdateTeamDto, me: UserEntity): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({ where: { teamId } });
    if (!team) {
      throw new WellKnownError({
        message: "Team not found",
        errorCode: "TEAM_NOT_FOUND",
      });
    }

    if (team.ownerId !== me.userId) {
      throw new WellKnownError({
        message: "You are not the owner of this team",
        errorCode: "TEAM_PERMISSION_DENIED",
      });
    }

    await this.teamRepository.update(teamId, param);
    const updated = await this.teamRepository.findOne({
      where: { teamId },
      relations: ["owner"],
    });
    if (!updated) {
      throw new WellKnownError({
        message: "Failed to update team",
        errorCode: "TEAM_UPDATE_FAILED",
      });
    }

    return updated;
  }

  async deleteTeam(teamId: string, me: UserEntity): Promise<void> {
    const team = await this.teamRepository.findOne({ where: { teamId } });
    if (!team) {
      throw new WellKnownError({
        message: "Team not found",
        errorCode: "TEAM_NOT_FOUND",
      });
    }

    if (team.ownerId !== me.userId) {
      throw new WellKnownError({
        message: "You are not the owner of this team",
        errorCode: "TEAM_PERMISSION_DENIED",
      });
    }

    await this.teamRepository.delete(teamId);
  }
}