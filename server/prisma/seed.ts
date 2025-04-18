import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.vault.createMany({
    data: [
      { vaultId: 'raid-0406', name: '4월 6일 깨어난 비취불꽃 트라이' },
      { vaultId: 'weekly-meeting', name: '주간 회의' },
    ],
  });

  await prisma.zone.createMany({
    data: [
      { zoneId: 'general', vaultId: 'raid-0406', name: '일반 대화', hasBoard: true, hasChat: true },
      { zoneId: 'strategy', vaultId: 'raid-0406', name: '공략 정리', hasBoard: true, hasChat: true },
      { zoneId: 'discussion', vaultId: 'weekly-meeting', name: '토론방', hasBoard: true, hasChat: true },
      { zoneId: 'minutes', vaultId: 'weekly-meeting', name: '회의록', hasBoard: true, hasChat: true },
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
