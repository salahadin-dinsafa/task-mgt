import { Body, Controller, Logger, Post } from '@nestjs/common';

import {
    ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@ApiBadRequestResponse({ description: 'Invalid request' })
@ApiInternalServerErrorResponse({ description: 'Internal server error occured' })
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');
    constructor(
        private readonly authService: AuthService
    ) { }
    @ApiOperation({ description: 'Registring user', summary: 'Register user' })
    @ApiConflictResponse({ description: 'user already exist' })
    @Post('signup')
    signup(@Body() signupDto: SignupDto): Promise<UserEntity> {
        this.logger.verbose(`User ${signupDto.username} is signing up`);
        return this.authService.signup(signupDto);
    }

    @ApiOperation({ description: 'login user', summary: 'Login user' })
    @ApiUnauthorizedResponse({ description: 'Invalid Creadential' })
    @ApiCreatedResponse({ description: '{accessToken: string}' })
    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
        this.logger.verbose(`User ${loginDto.username} is loging`);
        return this.authService.login(loginDto);
    }
}
