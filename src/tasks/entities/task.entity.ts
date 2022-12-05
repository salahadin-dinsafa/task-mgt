import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { TaskStatus } from "@app/tasks/types/task-status.enum";
import { UserEntity } from '@app/auth/entities/user.entity';


@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: '' })
    description: string;

    @ManyToOne(() => UserEntity, user => user.tasks, { eager: false })
    @JoinColumn()
    author: UserEntity

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
    status: TaskStatus
}