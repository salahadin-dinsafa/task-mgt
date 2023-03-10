import {
    ConflictException, Injectable,
    InternalServerErrorException, Logger, UnauthorizedException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';

import { SignupType } from './types/signup.interface';
import { UserEntity } from './entities/user.entity';
import { LoginType } from './types/login.interface';
import { JwtPayload } from './types/jwt-payload.interface';
import { Token } from './types/toke.type';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }

    async findByName(username: string): Promise<UserEntity> {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { username } });
        } catch (error) {
            this.logger.error(`${error.message}`)
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
        return user;
    }
    async signup(signup: SignupType): Promise<UserEntity> {
        const { username, password } = signup;
        let user: UserEntity = await this.findByName(username);
        if (user)
            throw new ConflictException('user already exist');
        try {
            user = this.userRepository.create({
                username,
                password
            })
            return this.getUserResponse(await user.save());
        } catch (error) {
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }

    async login(login: LoginType): Promise<Token> {
        const { username, password } = login;
        let user: UserEntity = await this.findByName(username);

        if (!user) throw new
            UnauthorizedException('Invalid Creadential');

        const isValidPassword: boolean = await compare(password, user.password);

        if (!isValidPassword) throw new
            UnauthorizedException('Invalid Creadential');
        const payload: JwtPayload = ({ username, role: user.role });
        const accessToken: string = await this.jwtService.signAsync(payload);
        this.logger.debug(`Generating Jwt token with payload: ${JSON.stringify(payload)}`)
        return { accessToken }
    }

    getUserResponse(user: UserEntity): UserEntity {
        delete user.password;
        if (user.tasks)
            delete user.tasks;
        return user;
    }
}
