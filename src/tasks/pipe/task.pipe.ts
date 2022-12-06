import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

import { TaskStatus } from "../types/task-status.enum";

export class TaskPipe implements PipeTransform {
    readonly validStatus: string[] = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]
    transform(value: string, _: ArgumentMetadata) {
        if (!value) throw new BadRequestException(`status must be provided`)
        const transformedValue = value.toUpperCase();
        if (!this.isValidStatus(transformedValue)) throw new BadRequestException(`status must be one of the following values: OPEN, IN_PROGRESS, DONE`)
        return transformedValue;
    }

    private isValidStatus(status: string): boolean {
        return this.validStatus.indexOf(status) !== -1;
    }
}