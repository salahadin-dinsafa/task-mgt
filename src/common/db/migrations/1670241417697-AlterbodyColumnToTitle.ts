import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterbodyColumnToTitle1670241417697 implements MigrationInterface {
    name = 'AlterbodyColumnToTitle1670241417697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "body" TO "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "title" TO "body"`);
    }

}
