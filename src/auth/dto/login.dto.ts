import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: "The name of user",
        example: "foo",
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: "The password of user",
        example: "12345678"
    })
    @IsNotEmpty()
    password: string;
}