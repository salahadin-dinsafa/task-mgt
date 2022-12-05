import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { TaskStatus } from "@app/tasks/types/task-status.enum";


@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: '' })
    description: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
    status: TaskStatus
}