import { DataSource } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { ChannelEntity } from "../../entities/channel.entity";
import { MessageEntity } from "../../entities/message.entity";
import { generateId } from "../../utils/id-generator";

export async function seedMessages(
  dataSource: DataSource,
  users: UserEntity[],
  dmChannelId: string,
  groupChannelId: string,
): Promise<{ dmCount: number; groupCount: number }> {
  const channelRepo = dataSource.getRepository(ChannelEntity);
  const messageRepo = dataSource.getRepository(MessageEntity);

  // ===== DM 메시지 생성 =====
  console.log("Creating DM messages...");
  const dmMessages = [
    { sender: users[0], content: "안녕 Bob!" },
    { sender: users[1], content: "안녕 Alice! 오랜만이야" },
    { sender: users[0], content: "요즘 뭐해?" },
    { sender: users[1], content: "그냥 코딩하고 있어 ㅋㅋ" },
    { sender: users[0], content: "오 뭐 만들어?" },
    { sender: users[1], content: "메신저 앱 만들고 있어" },
    { sender: users[0], content: "대박 재밌겠다" },
    { sender: users[1], content: "응 근데 어려워 ㅠㅠ" },
    { sender: users[0], content: "화이팅!" },
    { sender: users[1], content: "고마워 ㅎㅎ" },
  ];

  let dmSeq = 1;
  for (const msg of dmMessages) {
    const message = messageRepo.create({
      messageId: generateId(),
      channelId: dmChannelId,
      senderId: msg.sender.userId,
      seq: dmSeq++,
      content: msg.content,
    });
    await messageRepo.save(message);
  }
  await channelRepo.update({ channelId: dmChannelId }, { lastMessageAt: new Date() });
  console.log(`  Created ${dmMessages.length} DM messages`);

  // ===== 그룹 메시지 생성 (100개) =====
  console.log("Creating group messages...");
  const greetings = [
    "안녕하세요!",
    "ㅎㅇ",
    "반가워요~",
    "오늘 뭐해요?",
    "ㅋㅋㅋㅋ",
    "그러게요",
    "맞아요",
    "저도요!",
    "뭐해요 다들",
    "심심해요",
    "오늘 날씨 좋네요",
    "점심 뭐 먹었어요?",
    "저녁 같이 먹어요",
    "ㅎㅎㅎ",
    "그래요?",
    "대박",
    "진짜요?",
    "헐",
    "ㅇㅇ",
    "넵",
  ];

  let groupSeq = 1;
  for (let i = 0; i < 100; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const content = greetings[Math.floor(Math.random() * greetings.length)];

    const message = messageRepo.create({
      messageId: generateId(),
      channelId: groupChannelId,
      senderId: sender.userId,
      seq: groupSeq++,
      content,
    });
    await messageRepo.save(message);
  }
  await channelRepo.update({ channelId: groupChannelId }, { lastMessageAt: new Date() });
  console.log(`  Created 100 group messages`);

  return { dmCount: dmMessages.length, groupCount: 100 };
}
