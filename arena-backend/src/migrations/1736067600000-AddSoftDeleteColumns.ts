import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteColumns1736067600000 implements MigrationInterface {
    name = 'AddSoftDeleteColumns1736067600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // channels: deletedAt 추가
        await queryRunner.query(`ALTER TABLE "channels" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);

        // messages: deletedAt 추가
        await queryRunner.query(`ALTER TABLE "messages" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);

        // participants: joinedAt → createdAt 이름 변경, updatedAt, deletedAt 추가
        await queryRunner.query(`ALTER TABLE "participants" RENAME COLUMN "joinedAt" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "participants" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "participants" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);

        // contacts: updatedAt, deletedAt 추가
        await queryRunner.query(`ALTER TABLE "contacts" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // contacts: updatedAt, deletedAt 제거
        await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "updatedAt"`);

        // participants: createdAt → joinedAt 이름 변경, updatedAt, deletedAt 제거
        await queryRunner.query(`ALTER TABLE "participants" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "participants" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "participants" RENAME COLUMN "createdAt" TO "joinedAt"`);

        // messages: deletedAt 제거
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "deletedAt"`);

        // channels: deletedAt 제거
        await queryRunner.query(`ALTER TABLE "channels" DROP COLUMN "deletedAt"`);
    }
}
