import { ApiProperty } from "@nestjs/swagger";

export interface Token {
    accessToken: string;
}

export class TokenResponse {
    @ApiProperty({
        example: 'string'
    })
    accessToken: string;
}