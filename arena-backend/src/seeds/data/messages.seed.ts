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

  const [zina, tester1, tester2] = users;

  // ===== DM 메시지 생성 (Zina <-> 테스터1) =====
  console.log("Creating DM messages...");
  const dmMessages = [
    { sender: zina, content: "안녕하세요!" },
    { sender: tester1, content: "안녕하세요! 테스트 계정입니다 ㅎㅎ" },
    { sender: zina, content: "메시지 잘 오나 테스트 중이에요" },
    { sender: tester1, content: "네 잘 보여요!" },
    { sender: zina, content: "좋아요 👍" },
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

  // ===== 그룹 메시지 생성 =====
  console.log("Creating group messages...");
  const groupMessages = [
    { sender: zina, content: "그룹 채팅방 만들었어요!" },
    { sender: tester1, content: "오 반가워요~" },
    { sender: tester2, content: "저도 왔어요!" },
    { sender: zina, content: "다들 환영해요 ㅎㅎ" },
    { sender: tester1, content: "여기서 테스트하면 되는거죠?" },
    { sender: zina, content: "네 맞아요" },
    { sender: tester2, content: "알겠습니다!" },
    { sender: zina, content: "메시지 페이지네이션 테스트용으로 좀 더 채울게요" },
  ];

  // 추가 메시지로 20개 정도 채우기
  const fillerMessages = [
    "ㅎㅎ",
    "ㅋㅋㅋ",
    "넵",
    "확인했어요",
    "좋아요",
    "오키",
    "알겠습니다",
    "감사해요",
    "ㅇㅇ",
    "그렇군요",
    "잘됐네요",
    "대박",
  ];

  let groupSeq = 1;
  
  // 기본 메시지
  for (const msg of groupMessages) {
    const message = messageRepo.create({
      messageId: generateId(),
      channelId: groupChannelId,
      senderId: msg.sender.userId,
      seq: groupSeq++,
      content: msg.content,
    });
    await messageRepo.save(message);
  }

  // 필러 메시지 30개 추가
  for (let i = 0; i < 30; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const content = fillerMessages[Math.floor(Math.random() * fillerMessages.length)];

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
  const totalGroupMessages = groupMessages.length + 30;
  console.log(`  Created ${totalGroupMessages} group messages`);

  return { dmCount: dmMessages.length, groupCount: totalGroupMessages };
}
