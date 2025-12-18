import { DataSource } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { ChannelEntity } from "../../entities/channel.entity";
import { ParticipantEntity } from "../../entities/participant.entity";
import { DirectChannelEntity } from "../../entities/direct-channel.entity";
import { DirectParticipantEntity } from "../../entities/direct-participant.entity";
import { GroupChannelEntity } from "../../entities/group-channel.entity";
import { GroupParticipantEntity } from "../../entities/group-participant.entity";
import { generateId } from "../../utils/id-generator";

export interface SeedChannelsResult {
  dmChannelId: string;
  groupChannelId: string;
}

export async function seedChannels(
  dataSource: DataSource,
  users: UserEntity[],
): Promise<SeedChannelsResult> {
  const channelRepo = dataSource.getRepository(ChannelEntity);
  const participantRepo = dataSource.getRepository(ParticipantEntity);
  const directChannelRepo = dataSource.getRepository(DirectChannelEntity);
  const directParticipantRepo = dataSource.getRepository(DirectParticipantEntity);
  const groupChannelRepo = dataSource.getRepository(GroupChannelEntity);
  const groupParticipantRepo = dataSource.getRepository(GroupParticipantEntity);

  // ===== DM 채널 생성 (Alice <-> Bob) =====
  console.log("Creating DM channel...");
  const dmChannelId = generateId();

  const dmChannel = channelRepo.create({
    channelId: dmChannelId,
    type: "direct",
    name: null,
    teamId: null,
    lastMessageAt: null,
  });
  await channelRepo.save(dmChannel);

  const dmDirectChannel = directChannelRepo.create({ channelId: dmChannelId });
  await directChannelRepo.save(dmDirectChannel);

  // Alice 참여
  const aliceParticipant = participantRepo.create({
    channelId: dmChannelId,
    userId: users[0].userId,
    lastReadAt: null,
  });
  await participantRepo.save(aliceParticipant);

  const aliceDirectParticipant = directParticipantRepo.create({
    channelId: dmChannelId,
    userId: users[0].userId,
  });
  await directParticipantRepo.save(aliceDirectParticipant);

  // Bob 참여
  const bobParticipant = participantRepo.create({
    channelId: dmChannelId,
    userId: users[1].userId,
    lastReadAt: null,
  });
  await participantRepo.save(bobParticipant);

  const bobDirectParticipant = directParticipantRepo.create({
    channelId: dmChannelId,
    userId: users[1].userId,
  });
  await directParticipantRepo.save(bobDirectParticipant);

  console.log(`  Created DM: Alice <-> Bob`);

  // ===== 그룹 채널 생성 =====
  console.log("Creating group channel...");
  const groupChannelId = generateId();

  const groupChannel = channelRepo.create({
    channelId: groupChannelId,
    type: "group",
    name: "Test Group",
    teamId: null,
    lastMessageAt: null,
  });
  await channelRepo.save(groupChannel);

  const groupExtension = groupChannelRepo.create({
    channelId: groupChannelId,
    iconFileId: null,
  });
  await groupChannelRepo.save(groupExtension);

  // 모든 유저 참여
  for (let i = 0; i < users.length; i++) {
    const participant = participantRepo.create({
      channelId: groupChannelId,
      userId: users[i].userId,
      lastReadAt: null,
    });
    await participantRepo.save(participant);

    const groupParticipant = groupParticipantRepo.create({
      channelId: groupChannelId,
      userId: users[i].userId,
      role: i === 0 ? "owner" : "member",
      nickname: null,
    });
    await groupParticipantRepo.save(groupParticipant);
  }
  console.log(`  Created Group: Test Group (${users.length} members)`);

  return { dmChannelId, groupChannelId };
}
