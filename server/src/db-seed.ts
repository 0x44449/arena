import { DataSource } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { TeamEntity } from './entity/team.entity';
import { WorkspaceEntity } from './entity/workspace.entity';
import { nanoid } from 'nanoid';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [UserEntity, TeamEntity, WorkspaceEntity],
  synchronize: false, // ★ 이미 Entity로 생성했으면 true 필요없음
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(UserEntity);
  const teamRepo = AppDataSource.getRepository(TeamEntity);
  const workspaceRepo = AppDataSource.getRepository(WorkspaceEntity);

  // 기본 사용자
  const user = userRepo.create({
    userId: 'admin',
    email: 'admin@example.com',
    loginId: 'admin',
    displayName: 'Admin',
    password: 'hashed-password',
    avatarType: 'default',
    avatarKey: '1',
  });
  await userRepo.save(user);

  // 기본 팀
  const teamId1 = nanoid(12);
  const team = teamRepo.create({
    teamId: teamId1,
    name: 'Default Team',
    description: '초기 팀입니다.',
    ownerId: user.userId,
  });
  await teamRepo.save(team);

  // 기본 워크스페이스
  const workspace = workspaceRepo.create({
    workspaceId: nanoid(12),
    teamId: teamId1,
    name: 'General',
    description: '일반 워크스페이스',
    ownerId: user.userId,
  });
  await workspaceRepo.save(workspace);

  console.log('✅ Seed completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});