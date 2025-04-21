import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function main() {
  const idLength = 12;

  const vaultId1 = nanoid(idLength);
  const vaultId2 = nanoid(idLength);
  await prisma.vault.createMany({
    data: [
      { vaultId: vaultId1, name: '4월 6일 깨어난 비취불꽃 트라이', description: '', ownerId: 'zina-001'  },
      { vaultId: vaultId2, name: '주간 회의', description: '', ownerId: 'zina-001' },
    ],
  });

  const zoneId1 = nanoid(idLength);
  const zoneId2 = nanoid(idLength);
  const zoneId3 = nanoid(idLength);
  const zoneId4 = nanoid(idLength);
  await prisma.zone.createMany({
    data: [
      { zoneId: zoneId1, vaultId: vaultId1, name: '일반 대화', hasBoard: true, hasChat: true, description: '', ownerId: 'zina-001' },
      { zoneId: zoneId2, vaultId: vaultId1, name: '공략 정리', hasBoard: true, hasChat: true, description: '', ownerId: 'zina-001' },
      { zoneId: zoneId3, vaultId: vaultId2, name: '토론방', hasBoard: true, hasChat: true, description: '', ownerId: 'zina-001' },
      { zoneId: zoneId4, vaultId: vaultId2, name: '회의록', hasBoard: true, hasChat: true, description: '', ownerId: 'zina-001' },
    ],
  });

  await prisma.user.createMany({
    data: [
      { userId: 'zina-001', email: 'zina@gmail.com', loginId: 'zina', displayName: '진아', password: '1111', avatarType: 'default', avatarKey: 'default1', createdAt: new Date() },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
  