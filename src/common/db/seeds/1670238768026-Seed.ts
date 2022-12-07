import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1670238768026 implements MigrationInterface {
    name = 'Seed1670238768026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO users(username, password, role) VALUES 
            ('admin', '$2a$15$y3KljFJ4wyKURqfOG96.y.5L363O9BBMI7UI3oaPf312pGRaXqpGG', 'ADMIN'),
            ('foo', '$2a$15$y3KljFJ4wyKURqfOG96.y.5L363O9BBMI7UI3oaPf312pGRaXqpGG', 'USER')`
        );
        await queryRunner.query(
            `INSERT INTO tasks(title, description, status, "authorId") VALUES 
            ('Task 0', 'Task 0 description', 'OPEN', '1'),
            ('Task 1', 'Task 1 description', 'DONE', '1'), 
            ('Task 3', 'Task 3 description', 'OPEN', '2'), 
            ('Task 2', 'Task 2 description', 'IN_PROGRESS', '1')`
        );
    }

    public async down(): Promise<void> {
    }

}
