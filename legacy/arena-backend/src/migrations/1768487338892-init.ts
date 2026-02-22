import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1768487338892 implements MigrationInterface {
    name = 'Init1768487338892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("fileId" text NOT NULL, "ownerId" text NOT NULL, "storageKey" character varying(512) NOT NULL, "bucket" character varying(20) NOT NULL, "mimeType" character varying(127) NOT NULL, "size" bigint NOT NULL, "originalName" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_25150aaac483703a4ade8353fc3" PRIMARY KEY ("fileId"))`);
        await queryRunner.query(`CREATE INDEX "idx_files_owner_id" ON "files" ("ownerId") `);
        await queryRunner.query(`CREATE TABLE "users" ("userId" text NOT NULL, "uid" text NOT NULL, "utag" character varying(8) NOT NULL, "nick" character varying(32) NOT NULL, "email" character varying(255), "statusMessage" character varying(140), "avatarFileId" text, "deletedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_6e20ce1edf0678a09f1963f9587" UNIQUE ("uid"), CONSTRAINT "UQ_f2923c74b26fe155d06ba7a106e" UNIQUE ("utag"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE INDEX "idx_users_nick" ON "users" ("nick") `);
        await queryRunner.query(`CREATE TABLE "channels" ("channelId" text NOT NULL, "type" character varying(20) NOT NULL, "name" character varying(100), "teamId" text, "lastMessageAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f41d20ad5f355605bde63265d66" PRIMARY KEY ("channelId"))`);
        await queryRunner.query(`CREATE TABLE "participants" ("channelId" text NOT NULL, "userId" text NOT NULL, "lastReadAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_0e40d3c7ca626caecea86c355fa" PRIMARY KEY ("channelId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "idx_participants_user_id" ON "participants" ("userId") `);
        await queryRunner.query(`CREATE TABLE "messages" ("messageId" text NOT NULL, "channelId" text NOT NULL, "senderId" text NOT NULL, "seq" bigint NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9743b3cec687ac55895f0d79ae0" PRIMARY KEY ("messageId"))`);
        await queryRunner.query(`CREATE INDEX "idx_messages_channel_seq" ON "messages" ("channelId", "seq") `);
        await queryRunner.query(`CREATE TABLE "group_participants" ("channelId" text NOT NULL, "userId" text NOT NULL, "role" character varying(20) NOT NULL, "nickname" character varying(32), CONSTRAINT "PK_f69ea1fbae23583cbc7f7ddc9bd" PRIMARY KEY ("channelId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "group_channels" ("channelId" text NOT NULL, "iconFileId" text, CONSTRAINT "PK_8d16387f444690b01588eaf1c31" PRIMARY KEY ("channelId"))`);
        await queryRunner.query(`CREATE TABLE "direct_participants" ("channelId" text NOT NULL, "userId" text NOT NULL, CONSTRAINT "PK_af2fab6dfa169748c62755fd9ee" PRIMARY KEY ("channelId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "direct_channels" ("channelId" text NOT NULL, CONSTRAINT "PK_f9d50fb429c728f096a14451907" PRIMARY KEY ("channelId"))`);
        await queryRunner.query(`CREATE TABLE "devices" ("deviceId" text NOT NULL, "userId" text NOT NULL, "fcmToken" text NOT NULL, "platform" character varying(20) NOT NULL, "deviceModel" character varying(100), "osVersion" character varying(50), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_666c9b59efda8ca85b29157152c" PRIMARY KEY ("deviceId"))`);
        await queryRunner.query(`CREATE INDEX "idx_devices_user_id" ON "devices" ("userId") `);
        await queryRunner.query(`CREATE TABLE "contacts" ("ownerId" text NOT NULL, "userId" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_84b6140da23785badd9cbbf9e81" PRIMARY KEY ("ownerId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_a23484d1055e34d75b25f616792" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0385975205391a13e1d5d884f82" FOREIGN KEY ("avatarFileId") REFERENCES "files"("fileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participants" ADD CONSTRAINT "FK_88f4f6915a6405987161a4421bc" FOREIGN KEY ("channelId") REFERENCES "channels"("channelId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participants" ADD CONSTRAINT "FK_5fc9cddc801b973cd9edcdda42a" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5" FOREIGN KEY ("channelId") REFERENCES "channels"("channelId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_participants" ADD CONSTRAINT "FK_f69ea1fbae23583cbc7f7ddc9bd" FOREIGN KEY ("channelId", "userId") REFERENCES "participants"("channelId","userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_channels" ADD CONSTRAINT "FK_8d16387f444690b01588eaf1c31" FOREIGN KEY ("channelId") REFERENCES "channels"("channelId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_channels" ADD CONSTRAINT "FK_3722ff4c032114b2b4ebb753302" FOREIGN KEY ("iconFileId") REFERENCES "files"("fileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "direct_participants" ADD CONSTRAINT "FK_af2fab6dfa169748c62755fd9ee" FOREIGN KEY ("channelId", "userId") REFERENCES "participants"("channelId","userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "direct_channels" ADD CONSTRAINT "FK_f9d50fb429c728f096a14451907" FOREIGN KEY ("channelId") REFERENCES "channels"("channelId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_270a85b7f2d4b6821dc7642e6a8" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_30ef77942fc8c05fcb829dcc61d" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_30ef77942fc8c05fcb829dcc61d"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_270a85b7f2d4b6821dc7642e6a8"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6"`);
        await queryRunner.query(`ALTER TABLE "direct_channels" DROP CONSTRAINT "FK_f9d50fb429c728f096a14451907"`);
        await queryRunner.query(`ALTER TABLE "direct_participants" DROP CONSTRAINT "FK_af2fab6dfa169748c62755fd9ee"`);
        await queryRunner.query(`ALTER TABLE "group_channels" DROP CONSTRAINT "FK_3722ff4c032114b2b4ebb753302"`);
        await queryRunner.query(`ALTER TABLE "group_channels" DROP CONSTRAINT "FK_8d16387f444690b01588eaf1c31"`);
        await queryRunner.query(`ALTER TABLE "group_participants" DROP CONSTRAINT "FK_f69ea1fbae23583cbc7f7ddc9bd"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5"`);
        await queryRunner.query(`ALTER TABLE "participants" DROP CONSTRAINT "FK_5fc9cddc801b973cd9edcdda42a"`);
        await queryRunner.query(`ALTER TABLE "participants" DROP CONSTRAINT "FK_88f4f6915a6405987161a4421bc"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0385975205391a13e1d5d884f82"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_a23484d1055e34d75b25f616792"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP INDEX "public"."idx_devices_user_id"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TABLE "direct_channels"`);
        await queryRunner.query(`DROP TABLE "direct_participants"`);
        await queryRunner.query(`DROP TABLE "group_channels"`);
        await queryRunner.query(`DROP TABLE "group_participants"`);
        await queryRunner.query(`DROP INDEX "public"."idx_messages_channel_seq"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP INDEX "public"."idx_participants_user_id"`);
        await queryRunner.query(`DROP TABLE "participants"`);
        await queryRunner.query(`DROP TABLE "channels"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_nick"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."idx_files_owner_id"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
