import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";

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

export class CoustomeExceptionDto {
  @ApiProperty({
    description: 'Status code of error'
  })
  @IsNumber()
  statusCode: number;
  
  @ApiProperty({
    description: 'Error of exception'
  })
  @IsString()
  error: string;
  
  @ApiProperty({
    description: 'Error message'
  })
  @IsString()
  message: string;
  
  @ApiProperty({
    description: 'Url path'
  })
  @IsString()
  path: string;
  
  @ApiProperty({
    description: 'Url method'
  })
  @IsString()
  method: string;
  
  @ApiProperty({
    description: 'Time at which exception occurred'
  })
  @IsDate()
  timeStamp: Date;
}