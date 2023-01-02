import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignupDto {
    @ApiProperty({
        description: 'Name of the user',
        example: 'foo'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    username: string;

    @ApiProperty({
        description: 'Password of user',
        format: 'Must include Capital letters, Samll letters, and charater',
        example: 'foo1234.A'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' },)
    password: string;
}
