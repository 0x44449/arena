import { DataSource } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { generateId } from '../../utils/id-generator';

interface SeedUser {
  uid: string;
  email: string;
  nick: string;
  utag: string;
}

function parseSeedUser(envValue: string | undefined): SeedUser | null {
  if (!envValue) return null;
  const [uid, email, nick, utag] = envValue.split(',');
  if (!uid || !email || !nick || !utag) return null;
  return { uid, email, nick, utag };
}

function loadSeedUsers(): SeedUser[] {
  const users: SeedUser[] = [];

  for (let i = 1; i <= 10; i++) {
    const user = parseSeedUser(process.env[`SEED_USER_${i}`]);
    if (user) users.push(user);
  }

  if (users.length === 0) {
    throw new Error(
      'No seed users found. Please set SEED_USER_1, SEED_USER_2, ... in .env',
    );
  }

  return users;
}

export async function seedUsers(dataSource: DataSource): Promise<UserEntity[]> {
  const userRepo = dataSource.getRepository(UserEntity);
  const seedUsers = loadSeedUsers();

  console.log('Creating users...');
  const users: UserEntity[] = [];

  for (const seedUser of seedUsers) {
    const user = userRepo.create({
      userId: generateId(),
      uid: seedUser.uid,
      utag: seedUser.utag,
      nick: seedUser.nick,
      email: seedUser.email,
      statusMessage: `안녕하세요, ${seedUser.nick}입니다!`,
      avatarFileId: null,
    });
    await userRepo.save(user);
    users.push(user);
    console.log(`  Created user: ${user.nick} (${user.utag})`);
  }

  return users;
}
