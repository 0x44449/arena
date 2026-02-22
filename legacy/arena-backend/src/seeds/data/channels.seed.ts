import { DataSource } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { ChannelEntity } from '../../entities/channel.entity';
import { ParticipantEntity } from '../../entities/participant.entity';
import { DirectChannelEntity } from '../../entities/direct-channel.entity';
import { DirectParticipantEntity } from '../../entities/direct-participant.entity';
import { GroupChannelEntity } from '../../entities/group-channel.entity';
import { GroupParticipantEntity } from '../../entities/group-participant.entity';
import { generateId } from '../../utils/id-generator';

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
  const directParticipantRepo = dataSource.getRepository(
    DirectParticipantEntity,
  );
  const groupChannelRepo = dataSource.getRepository(GroupChannelEntity);
  const groupParticipantRepo = dataSource.getRepository(GroupParticipantEntity);

  const [zina, tester1, tester2] = users;

  // ===== DM 채널 생성 (Zina <-> 테스터1) =====
  console.log('Creating DM channel...');
  const dmChannelId = generateId();

  const dmChannel = channelRepo.create({
    channelId: dmChannelId,
    type: 'direct',
    name: null,
    teamId: null,
    lastMessageAt: null,
  });
  await channelRepo.save(dmChannel);

  const dmDirectChannel = directChannelRepo.create({ channelId: dmChannelId });
  await directChannelRepo.save(dmDirectChannel);

  // Zina 참여
  const zinaParticipant = participantRepo.create({
    channelId: dmChannelId,
    userId: zina.userId,
    lastReadAt: null,
  });
  await participantRepo.save(zinaParticipant);

  const zinaDirectParticipant = directParticipantRepo.create({
    channelId: dmChannelId,
    userId: zina.userId,
  });
  await directParticipantRepo.save(zinaDirectParticipant);

  // 테스터1 참여
  const tester1Participant = participantRepo.create({
    channelId: dmChannelId,
    userId: tester1.userId,
    lastReadAt: null,
  });
  await participantRepo.save(tester1Participant);

  const tester1DirectParticipant = directParticipantRepo.create({
    channelId: dmChannelId,
    userId: tester1.userId,
  });
  await directParticipantRepo.save(tester1DirectParticipant);

  console.log(`  Created DM: ${zina.nick} <-> ${tester1.nick}`);

  // ===== 그룹 채널 생성 (3명 전부) =====
  console.log('Creating group channel...');
  const groupChannelId = generateId();

  const groupChannel = channelRepo.create({
    channelId: groupChannelId,
    type: 'group',
    name: 'Arena 테스트 그룹',
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
      role: i === 0 ? 'owner' : 'member',
      nickname: null,
    });
    await groupParticipantRepo.save(groupParticipant);
  }
  console.log(`  Created Group: Arena 테스트 그룹 (${users.length} members)`);

  return { dmChannelId, groupChannelId };
}
