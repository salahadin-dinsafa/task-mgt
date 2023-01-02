import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { Role } from "./role.enum";

export interface UserResponseType {
    id: number;
    username: string;
    role: Role;
}

export class UserResponse {
    @ApiProperty({
        example: 'number'
    })
    id: number;

    @ApiProperty({
        example: 'string'
    })
    username: string;

    @ApiProperty({
        example: Role.USER
    })
    @IsEnum(Role)
    role: string;
}