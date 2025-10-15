import { TeamEntity } from "@/entities/team.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity) private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async createTeam(param: { name: string; description: string; ownerId: string }): Promise<TeamEntity> {
    const team = await this.teamRepository.create({
      teamId: nanoid(12),
      name: param.name,
      description: param.description,
      ownerId: param.ownerId,
    });

    return await this.teamRepository.save(team);
  }

  async findTeamById(teamId: string): Promise<TeamEntity | null> {
    return await this.teamRepository.findOne({ where: { teamId } });
  }
}