import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: "Name of the user",
        example: "foo",
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: "Password of user",
        example: "12345678"
    })
    @IsNotEmpty()
    password: string;
}