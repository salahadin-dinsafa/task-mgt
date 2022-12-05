import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTask1670238768026 implements MigrationInterface {
    name = 'CreateTask1670238768026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "body" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'OPEN', CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    }

}
