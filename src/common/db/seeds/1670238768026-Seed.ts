import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1670238768026 implements MigrationInterface {
    name = 'Seed1670238768026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO tasks(title, description, status) VALUES ('Task 0', 'Task 0 description', 'OPEN'),
            ('Task 1', 'Task 1 description', 'DONE'), ('Task 2', 'Task 2 description', 'IN_PROGRESS') `
        );
    }

    public async down(): Promise<void> {
    }

}
