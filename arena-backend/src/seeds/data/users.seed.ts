import { DataSource } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { generateId } from "../../utils/id-generator";

export async function seedUsers(dataSource: DataSource): Promise<UserEntity[]> {
  const userRepo = dataSource.getRepository(UserEntity);

  console.log("Creating users...");
  const users: UserEntity[] = [];

  const userNames = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
  for (let i = 0; i < userNames.length; i++) {
    const user = userRepo.create({
      userId: generateId(),
      uid: `test-uid-${i + 1}`,
      utag: `user${String(i + 1).padStart(4, "0")}`,
      nick: userNames[i],
      email: `${userNames[i].toLowerCase()}@test.com`,
      statusMessage: `Hi, I'm ${userNames[i]}!`,
      avatarFileId: null,
    });
    await userRepo.save(user);
    users.push(user);
    console.log(`  Created user: ${user.nick} (${user.utag})`);
  }

  return users;
}
