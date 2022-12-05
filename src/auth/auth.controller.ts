import { Body, Controller, Logger, Post } from '@nestjs/common';

import {
    ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { AuthService } from '@app/auth/auth.service';
import { SignupDto } from '@app/auth/dto/signup.dto';
import { UserEntity } from '@app/auth/entities/user.entity';
import { LoginDto } from '@app/auth/dto/login.dto';

@ApiBadRequestResponse({ description: 'Invalid request' })
@ApiInternalServerErrorResponse({ description: 'Internal server error occured' })
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiConflictResponse({ description: 'user already exist' })
    @Post('signup')
    signup(@Body() signupDto: SignupDto): Promise<UserEntity> {
        this.logger.verbose(`User ${signupDto.username} is signing up`);
        return this.authService.signup(signupDto);
    }

    @ApiUnauthorizedResponse({ description: 'Invalid Creadential' })
    @ApiCreatedResponse({ description: '{accessToken: string}' })
    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
        this.logger.verbose(`User ${loginDto.username} is loging`);
        return this.authService.login(loginDto);
    }
}
