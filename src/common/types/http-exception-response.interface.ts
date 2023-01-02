import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";
import { number } from "joi";

export interface HttpExceptionResponse {
  statusCode: number;
  error: string;
  message?: string;
}

export interface CoustomeHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timeStamp: Date;
}

export class CoustomeHttpException {
  @ApiProperty({
    example: 'number'
  })
  statusCode: number;

  @ApiProperty({
    example: 'string'
  })
  error: string;

  @ApiProperty({
    example: 'string'
  })
  message: string;

  @ApiProperty({
    example: 'string'
  })
  path: string;

  @ApiProperty({
    example: 'string'
  })
  method: string;

  @ApiProperty({
    example: 'Date'
  })
  timeStamp: Date;
}