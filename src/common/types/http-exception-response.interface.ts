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