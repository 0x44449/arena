import { TeamEntity } from "@/entities/team.entity";
import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTeamDto } from "./dtos/create-team.dto";
import { idgen } from "@/commons/id-generator";
import { ChannelEntity } from "@/entities/channel.entity";

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity) private readonly teamsRepository: Repository<TeamEntity>,
    @InjectRepository(ChannelEntity) private readonly channelRepository: Repository<ChannelEntity>,
  ) {}

  async createTeam(param: CreateTeamDto, owner: UserEntity): Promise<TeamEntity> {
    const team = this.teamsRepository.create({
      teamId: idgen.shortId(),
      name: param.name,
      description: param.description,
      owner: owner,
    });

    return await this.teamsRepository.save(team);
  }

  async findTeamByTeamId(teamId: string): Promise<TeamEntity> {
    const team = await this.teamsRepository.findOne({
      where: { teamId },
      relations: ['owner'],
    });

    if (!team) {
      throw new Error(`Team with ID ${teamId} not found`);
    }

    return team;
  }

  async findTeamsByUserId(userId: string): Promise<TeamEntity[]> {
    return await this.teamsRepository.find({
      where: { owner: { userId } },
      relations: ['owner'],
    });
  }

  async findChannelsByTeamId(teamId: string): Promise<ChannelEntity[]> {
    return await this.channelRepository.find({
      where: { teamId },
      relations: ['team', 'owner'],
    });
  }
}