import { Body, Controller, Logger, Post } from '@nestjs/common';

import {
    ApiBadRequestResponse, ApiConflictResponse,
    ApiCreatedResponse, ApiInternalServerErrorResponse,
    ApiOperation, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { UserResponse } from './types/user.type';
import { Token, TokenResponse } from './types/toke.type';
import {
    CoustomeHttpException
} from '../common/types/http-exception-response.interface';

@ApiBadRequestResponse({ type: CoustomeHttpException, description: 'Invalid request' })
@ApiInternalServerErrorResponse({ type: CoustomeHttpException, description: 'Internal server error occured' })
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');
    constructor(
        private readonly authService: AuthService
    ) { }
    @ApiCreatedResponse({ type: UserResponse, description: 'User Created' })
    @ApiOperation({ description: 'Registring user', summary: 'Register user' })
    @ApiConflictResponse({ type: CoustomeHttpException, description: 'user already exist' })
    @Post('signup')
    signup(@Body() signupDto: SignupDto): Promise<UserEntity> {
        this.logger.verbose(`User ${signupDto.username} is signing up`);
        return this.authService.signup(signupDto);
    }

    @ApiOperation({ description: 'login user', summary: 'Login user' })
    @ApiUnauthorizedResponse({ type: CoustomeHttpException, description: 'Invalid Creadential' })
    @ApiCreatedResponse({ type: TokenResponse, description: 'Successfuly logged in' })
    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<Token> {
        this.logger.verbose(`User ${loginDto.username} is loging`);
        return this.authService.login(loginDto);
    }
}
