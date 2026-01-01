import "dotenv/config";
import { DataSource } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { FileEntity } from "../entities/file.entity";
import { ChannelEntity } from "../entities/channel.entity";
import { ParticipantEntity } from "../entities/participant.entity";
import { DirectChannelEntity } from "../entities/direct-channel.entity";
import { DirectParticipantEntity } from "../entities/direct-participant.entity";
import { GroupChannelEntity } from "../entities/group-channel.entity";
import { GroupParticipantEntity } from "../entities/group-participant.entity";
import { MessageEntity } from "../entities/message.entity";
import { ContactEntity } from "../entities/contact.entity";
import { seedUsers } from "./data/users.seed";
import { seedChannels } from "./data/channels.seed";
import { seedMessages } from "./data/messages.seed";

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    UserEntity,
    FileEntity,
    ChannelEntity,
    ParticipantEntity,
    DirectChannelEntity,
    DirectParticipantEntity,
    GroupChannelEntity,
    GroupParticipantEntity,
    MessageEntity,
    ContactEntity,
  ],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  console.log("Database connected\n");

  const users = await seedUsers(dataSource);
  const { dmChannelId, groupChannelId } = await seedChannels(dataSource, users);
  const { dmCount, groupCount } = await seedMessages(dataSource, users, dmChannelId, groupChannelId);

  console.log("\n✅ Seed completed!");
  console.log(`  Users: ${users.length}`);
  console.log(`  Channels: 2 (1 DM, 1 Group)`);
  console.log(`  Messages: ${dmCount + groupCount}`);

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
