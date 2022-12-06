import {
    BaseEntity, BeforeInsert, Column,
    Entity, OneToMany, PrimaryGeneratedColumn
} from "typeorm";

import { hash } from 'bcryptjs';
import { Role } from "../types/role.enum";
import { TaskEntity } from "../../tasks/entities/task.entity";

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role

    @OneToMany(() => TaskEntity, taskEntity => taskEntity.author, {eager: true, cascade: true })
    tasks: TaskEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 15);
    }
}